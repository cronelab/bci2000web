import React, { useEffect, useContext, useState } from "react";
import { Modal, Table, Button, InputGroup } from "react-bootstrap";
import { BCI2K_DataConnection } from "bci2k";
import { useStore } from "../store";
const CAR = () => {
  // const {bci} = useContext(Context);
  const [channels, setChannels] = useState([]);
  const [excludedChannels, setExcludedChannels] = useState([]);
  useEffect(() => {
    const bciSourceData = new BCI2K_DataConnection(
      `ws://${window.location.hostname}:20100`
    );
    bciSourceData.connect().then(y => {
      bciSourceData.onSignalProperties = x => {
        setChannels(x.channels);
        // getChannels(x.channels);
      };
    });
  }, []);

  const excludeChans = (channel, state) => {
    if (state) {
      setExcludedChannels([...excludedChannels, channel]);
    } else {
      setExcludedChannels(excludedChannels.filter(ch => ch != channel));
    }
  };
  const createCARParam = () => {
    let channelsToKeep = channels.filter(chans => !excludedChannels.includes(chans));

          let chBlock = [];
          let channelBlock_ = [];
          channelsToKeep.forEach(ch => {
            ch.split("").forEach(letter => {
              if (isNaN(parseInt(letter, 10))) {
                chBlock.push(letter);
              } else {
                if (chBlock.length != 0) {
                  channelBlock_.push(chBlock.join(""));
                  chBlock = [];
                }
              }
            });
          });

          let script = ``
          script += `Set Parameter EnableSimpleCAR 1; `
          script += `Set Parameter Filtering stringlist ExcludeChannels= ${excludedChannels.length} ${excludedChannels.join(' ')}; `
          script += `Set Parameter Filtering stringlist CARChannels= ${channelsToKeep.length} ${channelsToKeep.join(' ')}; `
          script += `Set Parameter Filtering stringlist CARBlocks= ${channelBlock_.length} ${channelBlock_.join(' ')}; `
          script += `Set Parameter Filtering stringlist CAROutputChannels= ${excludedChannels.length + channelsToKeep.length} ${channelsToKeep.join(' ')} ${excludedChannels.join(' ')}; `
          useStore.getState().bci.execute(script)
  };

  return (
    <>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Channel Selector</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="table table-bordered">
            <thead>
              
              <tr>
                <th>Channels</th>
                <th>Exclude</th>
              </tr>
            </thead>
            <tbody>
              {channels.map(chan => {
                return (
                  <tr key={chan}>
                    <td>{chan}</td>
                    <td>
                      <InputGroup>
                        <InputGroup.Checkbox
                          as
                          Button
                          onClick={e => excludeChans(chan, e.target.checked)}
                        />
                      </InputGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => createCARParam()}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </>
  );
};

export default CAR;
