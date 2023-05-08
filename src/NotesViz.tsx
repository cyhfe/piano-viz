import { css } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import { forwardRef, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as d3 from "d3";
import * as Tone from "tone";
import { useSynth } from "./App";
interface NotesVizProps {
  data?: Midi | null;
  isPlaying?: boolean;
  notes: NoteJSON[];
  setNotes: React.Dispatch<React.SetStateAction<NoteJSON[]>>;
}

const NotesViz = forwardRef<SVGRectElement, NotesVizProps>(function NotesViz(
  props,
  ref
) {
  return (
    <>
      <svg
        css={css`
          display: block;
        `}
        viewBox="0 ,0, 400, 300"
        width={"100%"}
        height={"80%"}
        preserveAspectRatio="none"
      >
        <rect x={0} y={0} width={400} height={300} fill="black">
          {/* {notes.map((note) => {
            return (
              <Note
                key={note.name + note.time}
                note={note}
                setNotes={setNotes}
              />
            );
          })} */}
        </rect>
        <g ref={ref}></g>
      </svg>
    </>
  );
});

interface NoteJSON {
  time: number;
  midi: number;
  name: string;
  velocity: number;
  duration: number;
  ticks: number;
  durationTicks: number;
}

interface NoteProps {
  note: NoteJSON;
  setNotes: React.Dispatch<React.SetStateAction<NoteJSON[]>>;
  isPlaying?: boolean;
}

function Note({ note, isPlaying, setNotes }: NoteProps) {
  const ref = useRef<SVGElement | null>(null);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener("endEvent", () => {
      // if (!synth) return;
      console.log("end");
      setEnd(true);
      // setNotes((notes) => notes.filter((n) => n !== note));
    });
  }, [note, setNotes]);

  return !end ? (
    <rect className="note" x={195} width={10} height={10} fill="red">
      <animate
        ref={ref}
        attributeType="XML"
        attributeName="y"
        from="-20"
        to="300"
        dur={4 + "s"}
        begin={0}
      />
    </rect>
  ) : null;
}

export default NotesViz;
