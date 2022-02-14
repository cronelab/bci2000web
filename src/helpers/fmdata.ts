
class fmdata {
  metadata: any;
  contents: any;
  displayData: any;
  _channelStats: any;
  _clean: any;
  constructor() {
    this.metadata = {};
    this.contents = {};
    this.displayData = {};
    this._channelStats = {};
    this._clean = true;
  }

  private _setupChannelStats() {
    var dataset = this;
    if (this.contents.values !== undefined) {
      this._channelStats = undefined;
      return;
    }
    if (this.contents.stats !== undefined) {
      var stats = this.contents.stats;
      var channels = Object.keys(stats.estimators.mean);
      channels.forEach((ch) => {
        var mean = stats.estimators.mean[ch];
        var variance = stats.estimators.variance[ch];
        var count = stats.estimators.count[ch];
        if (dataset.isTimeseries()) {
          var baselineMean = stats.baseline.mean[ch];
          var baselineVariance = stats.baseline.variance[ch];
          var baselineCount = stats.baseline.count[ch];
          var statValues = mean.map(
            (d: any, i: any) => new Gaussian(mean[i], variance[i], count[i])
          );
          dataset._channelStats[ch] = new ChannelStat({
            baseline: new Gaussian(
              baselineMean,
              baselineVariance,
              baselineCount
            ),
            values: statValues,
          });
        } else {
          dataset._channelStats[ch] = new ChannelStat({
            values: [new Gaussian(mean, variance, count)],
          });
        }
      });
      return;
    }
    if (this.contents.trials !== undefined) {
      var trials = this.contents.trials;
      var channels = Object.keys(trials[0]);
      var newChannelOpts: any = {};
      if (dataset.isTimeseries()) {
        newChannelOpts.baselineWindow = this._windowInSamples(
          dataset.metadata.baselineWindow
        );
      }
      channels.forEach((ch) => {
        var newChannel = new ChannelStat(newChannelOpts);
        trials.forEach((trialData: any) => {
          newChannel.ingest(trialData[ch]);
        });
        dataset._channelStats[ch] = new ChannelStat();
      });
      return;
    }
    this._channelStats = undefined;
  }

  private _windowInSamples(windowInSeconds: any) {
    // if (!this.isTimeseries()) return undefined;
    if (this.contents === undefined) return undefined;
    if (!Array.isArray(this.contents.times)) return undefined;
    let dataStart = this.contents.times[0];
    let dataEnd = this.contents.times[this.contents.times.length - 1];
    let windowStart =
      ((windowInSeconds.start - dataStart) / dataEnd - dataStart) *
      this.contents.times.length;
    let windowEnd =
      ((windowInSeconds.end - dataStart) / dataEnd - dataStart) *
      this.contents.times.length;
    return {
      start: Math.ceil(windowStart),
      end: Math.floor(windowEnd),
    };
  }

  private _updateDisplayData() {
    var dataset = this;
    if (this.contents.values !== undefined) {
      this.displayData = this.contents.values;
      return Promise.resolve();
    }

    if (this.contents.stats !== undefined) {
      return Object.keys(this._channelStats).forEach((ch) => {
        dataset.displayData[ch] = dataset._channelStats[ch].fdrCorrectedValues(
          0.05
        );
      });
    }
    // console.log(this.displayData)
  }

  public ingest(trialData: any) {
    return new Promise<void>((resolve, reject) => {
      var dataset = this;

      Object.keys(this._channelStats).forEach((ch) =>
        dataset._channelStats[ch].ingest(trialData[ch])
      );

      dataset._updateContentsStats();
      if (dataset.contents.trials === undefined) dataset.contents.trials = [];
      dataset.contents.trials.push(trialData);
      dataset._clean = false;
      dataset._updateDisplayData();
      resolve();
    });
  }

  private _updateContentsStats() {
    var dataset = this;
    dataset.contents.stats = dataset.contents.stats || {};
    dataset.contents.stats.distribution = "gaussian";
    dataset.contents.stats.baseline = dataset.contents.stats.baseline || {};
    dataset.contents.stats.baseline.mean =
      dataset.contents.stats.baseline.mean || {};
    dataset.contents.stats.baseline.variance =
      dataset.contents.stats.baseline.variance || {};
    dataset.contents.stats.baseline.count =
      dataset.contents.stats.baseline.count || {};

    dataset.contents.stats.estimators = dataset.contents.stats.estimators || {};
    dataset.contents.stats.estimators.mean =
      dataset.contents.stats.estimators.mean || {};
    dataset.contents.stats.estimators.variance =
      dataset.contents.stats.estimators.variance || {};
    dataset.contents.stats.estimators.count =
      dataset.contents.stats.estimators.count || {};

    Object.keys(this._channelStats).forEach((ch) => {
      dataset.contents.stats.baseline.mean[ch] =
        dataset._channelStats[ch].baseline.mean;
      dataset.contents.stats.baseline.variance[ch] =
        dataset._channelStats[ch].baseline.variance;
      dataset.contents.stats.baseline.count[ch] =
        dataset._channelStats[ch].baseline.count;

      var values = dataset._channelStats[ch].values;

      if (!values) {
        dataset.contents.stats.estimators.mean[ch] = undefined;
        dataset.contents.stats.estimators.variance[ch] = undefined;
        dataset.contents.stats.estimators.count[ch] = undefined;
        return;
      }
      var extractor = (estimator: any) => (v: any) => v[estimator];

      if (!Array.isArray(values)) {
        dataset.contents.stats.estimators.mean[ch] = extractor("mean")(values);
        dataset.contents.stats.estimators.variance[ch] = extractor("variance")(
          values
        );
        dataset.contents.stats.estimators.count[ch] = extractor("count")(
          values
        );
        return;
      }
      dataset.contents.stats.estimators.mean[ch] = values.map(
        extractor("mean")
      );
      dataset.contents.stats.estimators.variance[ch] = values.map(
        extractor("variance")
      );
      dataset.contents.stats.estimators.count[ch] = values.map(
        extractor("count")
      );
    });
  }

  //This is only for Record
  get(data: any) {
    var dataset = this;
    dataset._clean = true;
    let { values, stats, trials } = data.contents;
    return new Promise<void>((resolve, reject) => {
      if (values === undefined && stats === undefined && trials === undefined) {
        reject("Loaded dataset lacks content.");
        return;
      }
      dataset.metadata = data.metadata;
      dataset.contents = data.contents;
      dataset._setupChannelStats();
      dataset._updateDisplayData();
      resolve();
    });

    // return new Promise((resolve, reject) => {
    // 	if (values === undefined && stats === undefined && trials === undefined) {
    // 		reject('Loaded dataset lacks content.');
    // 		return;
    // 	}
    // 	resolve({
    // 		'metadata': Object.assign({}, data.metadata),
    // 		'contents': Object.assign({}, data.contents)
    // 	});
    // }).then(validatedData => {
    // 	dataset.metadata = validatedData.metadata;
    // 	dataset.contents = validatedData.contents;
    // 	dataset._setupChannelStats();
    // }).then(() => dataset._updateDisplayData());
  }

  put(url: any, opts: any) {
    var options = {
      import: false,
    };
    if (opts) Object.assign(options, opts);

    var dataset = this;

    return new Promise((resolve, reject) => {
      // Deep copy
      var dataToSend = JSON.parse(
        JSON.stringify({
          metadata: dataset.metadata,
          contents: dataset.contents,
        })
      );

      if (options.import) dataToSend.metadata["_import"] = options.import;

      fetch(url, {
        method: "PUT",
        body: JSON.stringify(dataToSend),
      }).then((data) => {
        dataset._clean = true;
        resolve(data);
      });
    });
  }

  public setupChannels(channels: any) {
    var dataset = this;
    this.metadata.montage = channels;
    if (this._channelStats === undefined) this._channelStats = {};
    channels.forEach((ch: any) => {
      let newBaselineWindow = undefined;
      if (dataset.metadata) newBaselineWindow = dataset.metadata.baselineWindow;
      dataset._channelStats[ch] = new ChannelStat({
        baselineWindow: dataset._windowInSamples(newBaselineWindow),
      });
    });
    this._clean = false;
  }

  private isTimeseries() {
    if (this.metadata.labels.indexOf("timeseries") >= 0) {
      return true;
    }

    var someMember = (obj: any): any => {
      var ret = null;
      Object.keys(obj).every((k) => {
        ret = obj[k];
        return false;
      });
      return ret;
    };

    // If we have values, and an individual value entry is an array, we're a timeseries
    if (this.contents.values !== undefined) {
      if (Array.isArray(someMember(this.contents.values))) {
        return true;
      }
    }

    // Similar condition, but for stats.estimators
    if (this.contents.stats !== undefined) {
      if (this.contents.stats.estimators !== undefined) {
        var someEstimator = someMember(this.contents.estimators);
        if (Array.isArray(someMember(someEstimator))) {
          return true;
        }
      }
    }
    return false;
  }

  getTimeBounds() {
    if (!this.isTimeseries() || !this.contents.times) {
      return undefined;
    }

    return {
      start: this.contents.times[0],
      end: this.contents.times[this.contents.times.length - 1],
    };
  }

  updateTimesFromWindow(timeWindow: any, nTimes: any) {
    var newTimes = [];
    for (var i = 0; i < nTimes; i++) {
      newTimes.push(
        timeWindow.start +
        (i / (nTimes - 1)) * (timeWindow.end - timeWindow.start)
      );
    }
    this.contents.times = newTimes;
  }

  getTrialCount() {
    let { trials, stats } = this.contents;
    if (trials !== undefined) {
      return trials.length;
    }
    if (stats !== undefined) {
      if (stats.distribution.toLowerCase() == "gaussian") {
        var counts = stats.estimators.count;
        return Object.keys(counts)
          .reduce((acc, ch) => acc.concat(counts[ch]), [])
          .reduce((a, b) => Math.min(a, b));
      }
    }
    return undefined;
  }

  dataForTime(time: any) {
    if (!this.isTimeseries()) return undefined;
    var dataset = this;
    var dataSamples = 0;
    Object.keys(this.displayData).every(function (ch) {
      dataSamples = dataset.displayData[ch].length;
      return false;
    });

    var dataWindow = {
      start: this.contents.times[0],
      end: this.contents.times[this.contents.times.length - 1],
    };
    var timeIndexFloat =
      ((time - dataWindow.start) / (dataWindow.end - dataWindow.start)) *
      dataSamples;
    var timeIndex = Math.floor(timeIndexFloat);
    var timeFrac = timeIndexFloat - timeIndex;

    let disp = Object.keys(dataset.displayData).reduce(function (obj: any, ch) {
      let ins = dataset.displayData[ch];
      obj[ch] =
        (1.0 - timeFrac) * ins[timeIndex] + timeFrac * ins[timeIndex + 1];
      return obj;
    }, {});

    return disp;
  }

  updateBaselineWindow(newWindow: any) {
    this.metadata.baselineWindow = newWindow;
    var newWindowSamples = this._windowInSamples(newWindow);
    if (newWindowSamples === undefined) return Promise.resolve();
    return Object.keys(this._channelStats).forEach((ch) =>
      this._channelStats[ch].recompute(newWindowSamples)
    );
  }
}
class Gaussian {
  mean: any;
  variance: any;
  count: any;
  _m2: any;
  constructor(mu?: any, s2?: any, n?: any) {
    this.mean = mu;
    this.variance = s2;
    this.count = n;

    this._m2 =
      this.count > 1 && this.variance !== undefined
        ? this.variance * (this.count - 1)
        : undefined;

  }

  ingest(datum: any) {
    var delta = this.mean === undefined ? datum : datum - this.mean;
    this.count = this.count === undefined ? 1 : this.count + 1;
    this.mean =
      this.mean === undefined ? datum : this.mean + delta / this.count;
    this._m2 =
      this._m2 === undefined
        ? delta * (datum - this.mean)
        : this._m2 + delta * (datum - this.mean);
    this.variance = this.count < 2 ? undefined : this._m2 / (this.count - 1);
  }
}

class ChannelStat {
  baseline: any;
  values: any;
  baselineWindow: any;
  valueTrials: any;
  constructor(options?: any) {
    if (!options) options = {};
    this.baseline = options.baseline || new Gaussian();
    this.values = options.values || null;
    this.baselineWindow = options.baselineWindow || {
      start: 0,
      end: 10,
    };
    this.valueTrials = [];
  }
  recompute(baselineWindow: any) {
    var stat = this;
    if (baselineWindow) {
      if (baselineWindow.start) {
        this.baselineWindow.start = baselineWindow.start;
      }
      if (baselineWindow.end) {
        this.baselineWindow.end = baselineWindow.end;
      }
    }
    // Reset the stat values to defaults
    this.baseline = new Gaussian();
    this.values = null;
    // Recompute all the data anew
    this.valueTrials.forEach((trialData: any) => stat.ingest(trialData));
  }
  ingest(data: any) {
    var baselineData = data.slice(
      this.baselineWindow.start,
      this.baselineWindow.end + 1
    );
    // Compute summary statistics
    this.ingestValues(data);
    this.ingestBaseline(baselineData);
    // Aggregate new trial data
    this.valueTrials.push(data);
  }

  ingestBaseline(data: any) {
    var stat = this;

    // Add each datum to the baseline distribution
    data.forEach((d: any) => stat.baseline.ingest(d));
  }

  ingestValues(data: any) {
    var stat = this;
    if (!this.values) {
      this.values = [];
      data.forEach((d: any) => stat.values.push(new Gaussian()));
    }
    data.forEach((d: any, i: number) => stat.values[i].ingest(d));
  }

  meanValues() {
    return this.values.map((v: any) => v.mean);
  }

  baselineNormalizedValues() {
    // TODO Wrong form of baseline normalization; should use SEM units?
    // TODO Check limit description in maxcog demo notebook.

    var stat = this;
    return this.values.map((v: any) => {
      if (stat.baseline.variance === undefined)
        return v.mean - stat.baseline.mean;
      return (v.mean - stat.baseline.mean) / Math.sqrt(stat.baseline.variance);
    });
  }

  _thresholdedValues(threshold: any) {
    return this.baselineNormalizedValues().map((v: any) =>
      Math.abs(v) > threshold ? v : 0.0
    );
  }

  erfc(x: any) {
    var z = Math.abs(x);
    var t = 1 / (1 + z / 2);
    var r =
      t *
      Math.exp(
        -z * z -
        1.26551223 +
        t *
        (1.00002368 +
          t *
          (0.37409196 +
            t *
            (0.09678418 +
              t *
              (-0.18628806 +
                t *
                (0.27886807 +
                  t *
                  (-1.13520398 +
                    t *
                    (1.48851587 +
                      t * (-0.82215223 + t * 0.17087277))))))))
      );
    return x >= 0 ? r : 2 - r;
  }

  ierfc(x: any) {
    if (x >= 2) return -100;
    if (x <= 0) return 100;

    var xx = x < 1 ? x : 2 - x;
    var t = Math.sqrt(-2 * Math.log(xx / 2));
    var r =
      -0.70711 *
      ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);
    for (var j = 0; j < 2; j++) {
      var err = this.erfc(r) - xx;
      r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
    }
    return x < 1 ? r : -r;
  }

  ppfn(x: any, mean: any, variance: any) {
    return mean - Math.sqrt(2 * variance) * this.ierfc(2 * x);
  }

  // pointwiseCorrectedValues(alpha: any, bothWays: any) {
  //   var twoTailed = true;
  //   if (bothWays !== undefined) {
  //     twoTailed = bothWays;
  //   }
  //   var threshold = this.ppfn(1 - alpha / (twoTailed ? 2 : 1), 0.0, 1.0);

  //   return this._thresholdedValues(threshold);
  // }

  // bonferroniCorrectedValues(alpha: any, bothWays: any) {
  //   var twoTailed = true;
  //   if (bothWays !== undefined) {
  //     twoTailed = bothWays;
  //   }
  //   var threshold = this.ppfn(
  //     1 - alpha / ((twoTailed ? 2 : 1) * this.values.length),
  //     0.0,
  //     1.0
  //   );

  //   return this._thresholdedValues(threshold);
  // }

  baselineComparisonPValues() {
    let stat = this;

    let tValues = this.values.map((v: any) => {
      if (stat.baseline.variance === undefined) return 0.0; // Can't compare against a singular baseline

      let num = v.mean - stat.baseline.mean;
      // Don't include value's variance if it is singular
      let den = Math.sqrt(
        stat.baseline.variance / stat.baseline.count +
        (v.variance === undefined ? 0.0 : v.variance / v.count)
      );

      return num / den;
    });
    return tValues.map(
      (t: any) => 2.0 * (1.0 - this.cdfn(Math.abs(t), 0.0, 1.0))
    ); // TODO Using asymptotic normal theory; should allow non-asymptotic case
  }

  cdfn(x: any, mean: any, variance: any) {
    return 0.5 * this.erfc(-(x - mean) / Math.sqrt(2 * variance));
  }
  argsort(arr: any) {
    let ret: any = {
      values: [],
      indices: [],
    };

    arr
      .map((d: any, i: number) => [d, i])
      .sort((left: any, right: any) => (left[0] < right[0] ? -1 : 1))
      .forEach((d: any) => {
        ret.values.push(d[0]);
        ret.indices.push(d[1]);
      });
    return ret;
  }

  fdrCorrectedValues(fdr: any) {
    // Compute p-values
    var pValues = this.baselineComparisonPValues();
    // console.log(pValues)
    // Sort p-values
    var sortResult = this.argsort(pValues);

    // Determine the critical sort index k
    var kGood = -1;
    var nTests = sortResult.values.length;
    sortResult.values.every((p: any, k: any) => {
      if (p > ((k + 1) / nTests) * fdr) return false;
      kGood = k;
      return true;
    });

    // Determine which sorted hypotheses we should reject
    var canReject = pValues.map((p: any) => false);
    sortResult.indices.every((i: any, k: any) => {
      // k = index in sort
      if (k > kGood) return false;
      canReject[i] = true; // i = original index
      return true;
    });
    // Return the thresholded normalized values
    return this.baselineNormalizedValues().map((v: any, i: number) =>
      canReject[i] ? v : 0.0
    );
  }
}

export { fmdata, Gaussian, ChannelStat };
