import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { css, Global } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import NotesViz from "./NotesViz";

const SynthContext = createContext<SynthContextValue | null>(null);
interface SynthContextValue {
  synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null;
}
interface SynthProviderProps {
  children: React.ReactNode;
  synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null;
}
function SynthProvider({ children, synth }: SynthProviderProps) {
  const ctx = useMemo(() => {
    return { synth };
  }, [synth]);
  return <SynthContext.Provider value={ctx}>{children}</SynthContext.Provider>;
}

function useSynth(): SynthContextValue {
  const ctx = useContext(SynthContext);
  if (!ctx) throw Error;
  return ctx;
}

function App() {
  // const midiRef = useRef<Midi | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null>(
    null
  );
  // const time = useRef(null)
  function handleClick() {
    play();
  }

  async function play() {
    if (!midiData) return;
    await Tone.start();
    //the file name decoded from the first track
    const name = midiData.name;

    const synths = [];
    //get the tracks
    // Tone.Transport.start(4);
    setIsPlaying(true);
  }

  // useEffect(() => {
  //   if (!midiData) return;
  //   Tone.Transport.on("start", () => {
  //     // setIsPlaying(true);
  //     console.log("start");
  //   });
  //   midiData.tracks.forEach((track) => {
  //     //tracks have notes and controlChanges
  //     // console.log(track.instrument);

  //     const synth = new Tone.PolySynth(Tone.Synth, {
  //       envelope: {
  //         attack: 0.02,
  //         decay: 0.1,
  //         sustain: 0.3,
  //         release: 1,
  //       },
  //     }).toDestination();
  //     // synths.push(synth);
  //     //notes are an array
  //     const notes = track.notes;
  //     // console.log(notes);

  //     notes.forEach((note) => {
  //       // console.log(notes);
  //       //note.midi, note.time, note.duration, note.name
  //       // Tone.Transport.scheduleOnce((time) => {
  //       //   synth.triggerAttackRelease(
  //       //     note.name,
  //       //     note.duration,
  //       //     time,
  //       //     note.velocity
  //       //   );
  //       // }, note.time);
  //     });
  //   });
  // }, [midiData]);

  useEffect(() => {
    async function getData() {
      const data = await Midi.fromUrl("/assets/bach_inventions_773.mid");
      setMidiData(data);
    }
    getData();
  }, []);

  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination();
    }
  }, []);

  return (
    <SynthProvider synth={synthRef.current}>
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
          <button onClick={() => handleClick()}>++</button>
          <button
            onClick={() => {
              // console.log(Tone.Transport.now());
            }}
          ></button>
        </div>

        <NotesViz data={midiData} isPlaying={isPlaying} />

        <svg
          viewBox="0 0 600 300"
          css={css`
            display: block;
            width: 100%;
            height: 10%;
          `}
        ></svg>
      </div>
    </SynthProvider>
  );
}

export { useSynth, App };
