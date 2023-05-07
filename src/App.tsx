import { useEffect, useRef, useState } from "react";
import { css, Global } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import NotesViz from "./NotesViz";

function App() {
  // const midiRef = useRef<Midi | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);

  function handleClick() {
    play();
  }

  async function play() {
    if (!midiData) return;
    await Tone.start();
    //the file name decoded from the first track
    const name = midiData.name;

    const now = Tone.now() + 0.5;

    const synths = [];
    //get the tracks
    midiData.tracks.forEach((track) => {
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
      const data = await Midi.fromUrl("/assets/bach_inventions_773.mid");
      setMidiData(data);
    }
    getData();
  }, []);

  return (
    <>
      <div
        css={css`
          height: 100vh;
        `}
      >
        <div
          css={css`
            height: 10%;
          `}
        >
          123
        </div>
        <NotesViz data={midiData} />

        <svg
          viewBox="0 0 600 300"
          css={css`
            display: block;
            width: 100%;
            height: 10%;
          `}
        ></svg>
      </div>
    </>
  );
}

export default App;
