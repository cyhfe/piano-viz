import { useEffect, useRef } from "react";

import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

function App() {
  const midiRef = useRef<Midi | null>(null);

  function handleClick() {
    play();
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
      console.log(track.instrument);

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
        console.log(notes);
        //note.midi, note.time, note.duration, note.name
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now,
          note.velocity
        );
      });
    });
  }

  useEffect(() => {
    async function getData() {
      midiRef.current = await Midi.fromUrl("/assets/liszt_liebestraum.mid");
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
