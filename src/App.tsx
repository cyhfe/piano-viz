import { useEffect, useRef } from "react";

import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

function App() {
  const midiRef = useRef<Midi | null>(null);

  function handleClick() {
    // await Tone.start();
    play();
    // const synth = new Tone.Synth().toDestination();
    // const now = Tone.now();
    // synth.triggerAttackRelease("C4", "8n", now);
    // synth.triggerAttackRelease("E4", "8n", now + 0.5);
    // synth.triggerAttackRelease("G4", "8n", now + 1);
  }

  async function play() {
    if (!midiRef.current) return;
    await Tone.start();
    //the file name decoded from the first track
    const name = midiRef.current.name;

    const now = Tone.now() + 0.5;

    const synths = [];
    //get the tracks

    midiRef.current.tracks.forEach((track) => {
      //tracks have notes and controlChanges
      console.log(track);

      const synth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination();
      synths.push(synth);
      //notes are an array
      const notes = track.notes;
      // console.log(notes);

      notes.forEach((note) => {
        //note.midi, note.time, note.duration, note.name
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now,
          note.velocity
        );
      });

      //the control changes are an object
      //the keys are the CC number
      // track.controlChanges[64];
      //they are also aliased to the CC number's common name (if it has one)
      // track.controlChanges.sustain.forEach((cc) => {
      //   // cc.ticks, cc.value, cc.time
      // });

      //the track also has a channel and instrument
      //track.instrument.name
    });
  }

  useEffect(() => {
    async function getData() {
      midiRef.current = await Midi.fromUrl("/assets/sd-theme.mid");
    }
    getData();
  }, []);

  return (
    <div>
      <button onClick={handleClick}>click</button>
      app
    </div>
  );
}

export default App;
