Single Pulse Electrical Stimulation
==============================================

(Sub)Cortico-(Sub)Cortico Evoked Potentials
--------------------------------------------------
.. image:: ./images/EvokedPotentials.png

.. code-block:: json

    {
        "reciprocal": {
            "chan1_chan2": {
                "response": "chan3_chan4"
            }
        },
        "samplingRate": 1000,
        "significant": {
             "chan1_chan2": 1,
        },
        "time": {
            "chan1_chan2": [-54.354406730593283]
        },
           
        "window": [
            -500,
            1500
        ],
        "zscores": {
            "chan1_chan2": {
                "n1": [
                    535,
                    10.028049634488145
                ],
                "n2": [
                    601,
                    14.02594624915977
                ],
                "p2": [
                    546,
                    -2.2825574277800249
                ],
                "flipped": 1,
                "overall": [
                    535,
                    10.028049634488145
                ]
            }
        }
    }

The ResponseInfo data structure contains relevant information about the average responses from one block of single-pulse electrical stimulation of a pair of electrodes. 

+ reciprocal   
    - contains a list of all channels that have a reciprocal relationship with the stimulated electrodes whose ResponseInfo is being viewed. This means 1) they showed a significant response in this stimulation block, and 2) when they were stimulated in a different block, they elicited a significant response in the electrodes whose ResponseInfo is being viewed. The “response” subfield for each channel will contain the names of the channels that showed a significant response upon stimulation of the above electrodes. For bipolar referencing, this will simply be the electrode pair whose ResponseInfo is currently viewed, but for monopolar referencing, this will be either one or both of these electrodes. 

+ samplingRate
    - contains the sampling rate in Hz of the data collected 

+ significant 
    - contains a list of all channels recorded in this stimulation block, and all channels with significant responses are labeled with a “1” under the channel’s field 

+ time   
    - contains a list of all channels recorded in this stimulation block, and under each channel’s field is the time series of the channel’s average response, time-locked to stimulus 

+ window
    - contains the start and end time-points in milliseconds, relative to stimulus, of the time series of each channel contains in the “time” field 

+ zscores
    - contains a list of all channels recorded in this stimulation block, and under each channel’s field are measures of the timing and magnitude of average evoked potential’s peaks. N1 and N2 peaks are identified within 10-50 ms and 100-350 ms post-stimulus time windows, respectively, and P2 is identified as a peak with opposite polarity between the n1 and n2 timepoints. The “n1”, “n2”, and “p2” fields contain the index in the time series within “time” at which the peak can be found, followed by the normalized magnitude of the peak (the z-score). “flipped” contains a 1 or 0 indicating whether the polarity of the n1/n2/p2 potentials appear flipped, relative to the convention of n1 and n2 being negative and p2 positive. “overall” indicates the overall z-score used to quantify the channel’s response. If the absolute value of the channel’s n1 z-score was greater than 6, this field will contain the time index and absolute value of the n1 z-score is displayed. Otherwise, placeholder values of [1, 0].  

(Sub)Cortico-(Sub)Cortico Spectral Responses
---------------------------------------------------
.. image:: ./images/SpectralResponses.png

.. code-block:: json

    {
        "highGamma": {
            "frequencyBand": [
                70,
                110
            ],
            "samplingRate": 1000,
            "significant": [],
            "time": {
                "LAM1_LAM2": [
                    -1.9207325728872038
                ]
            },
            "window": [
                -450,
                1000
            ],
            "sscores": {
                "LAM1_LAM2": {
                    "ER": [
                        461,
                        108.36628284815538
                    ],
                    "DR": [
                        1245,
                        2.5120641548211311
                    ]
                }
            }
        },
        "lowGamma": {
            "frequencyBand": [
                20,
                55
            ],
            "samplingRate": 1000,
            "significant": [],
            "time": {
                "LAM1_LAM2": [
                    -1.9207325728872038
                ]
            },
            "window": [
                -450,
                1000
            ],
            "sscores": {
                "LAM1_LAM2": {
                    "ER": [
                        461,
                        108.36628284815538
                    ],
                    "DR": [
                        1245,
                        2.5120641548211311
                    ]
                }
            }
        }
    }

The field structure under “highGamma” and “lowGamma” is identical, containing information from different frequency bands. 

+ frequencyBand
    - contains the bandpass frequencies in Hz 

+ samplingRate
    - contains the sampling rate in Hz of the data collected 

+ significant
    - contains a list of all channels recorded in this stimulation block, and all channels with significant responses are labeled with a “1” under the channel’s field 

+ time
    - contains a list of all channels recorded in this stimulation block, and under each channel’s field is the time series of the channel’s average filtered spectral response, time-locked to stimulus 

+ window
    - contains the start and end time-points in milliseconds, relative to stimulus, of the time series of each channel contains in the “time” field 

+ sscores
    - contains a list of all channels recorded in this stimulation block, and under each channel’s field are measures of the timing and magnitude of spectral responses. The “ER” and “DR” (early response and delayed response) fields contain the index in the time series within “time” and the magnitude of the maximum spectral response within 10-100 ms or 100-1000 ms post-stimulus time windows, respectively for ER and DR.  
