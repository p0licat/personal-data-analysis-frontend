import { fetchGraphDataFromAudioAsync } from "@/lib/redux/slices/counterSlice/thunks";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default interface MicrophoneViewProps {}

export const MicrophoneView = (props: MicrophoneViewProps) => {
  const dispatch = useDispatch();

  const MicRecorder = require("mic-recorder-to-mp3");
  //const recorder = new MicRecorder({ bitRate: 128 });
  const recorder = useRef(new MicRecorder({ bitRate: 128 }));
  const shouldStop = useRef(true);
  const started = useRef(false);

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  function cycleRecording() {
    recorder.current
      .stop()
      .getMp3()
      .then(([buffer, blob]: Array<any>) => {
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, "me-at-thevoice.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });

        console.log(file);

        dispatch<any>(fetchGraphDataFromAudioAsync(file));
        //const player = new Audio(URL.createObjectURL(file));
        //player.play(); // should simulate request
        timeout(100);
      })
      .catch((e: any) => {
        alert("We could not retrieve your message");
        console.log(e);
      });
  }

  function stopRecordingButton() {
    shouldStop.current = true;
    //setShouldStop(true);
    recorder.current
      .stop()
      .getMp3()
      .then(([buffer, blob]: Array<any>) => {
        //setStarted(false);
        started.current = false;
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, "me-at-thevoice.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });

        console.log(file);

        dispatch<any>(fetchGraphDataFromAudioAsync(file));
        //const player = new Audio(URL.createObjectURL(file));
        //player.play(); // should simulate request
        timeout(100);
      })
      .catch((e: any) => {
        alert("We could not retrieve your message");
        console.log(e);
      });
  }

  const MINUTE_MS = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Logs every minute");
      console.log("Started: ");
      console.log(started.current);
      if (started.current) {
        cycleRecording();
      }
      if (!shouldStop.current && started.current) {
        startRecording();
      }
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  function startRecording() {
    recorder.current
      .start()
      .then(() => {
        // something else
        console.log("Started: ");
        console.log(started);
        started.current = true;
        console.log("Started: ");
        console.log(started);
        shouldStop.current = false;
      })
      .catch((e: any) => {
        console.error(e);
        shouldStop.current = false;
      });
  }

  return (
    <div>
      <button onClick={startRecording} type="button">
        Start
      </button>
      <button onClick={stopRecordingButton} type="button">
        Stop
      </button>
    </div>
  );
};
