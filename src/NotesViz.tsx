import { css } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as d3 from "d3";

interface NotesVizProps {
  data: Midi | null;
}

function NotesViz({ data }: NotesVizProps) {
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <svg
      css={css`
        display: block;
      `}
      viewBox="0 ,0, 400, 300"
      width={"100%"}
      height={"80%"}
      preserveAspectRatio="none"
    >
      <rect x={0} y={0} width={400} height={300} fill="black"></rect>
      {data &&
        data.tracks.map((track) => {
          return (
            <g className="track" key={uuidv4()}>
              {track.notes.map((note) => {
                return <Note note={note} />;
              })}
            </g>
          );
        })}
    </svg>
  );
}

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
}

function Note({ note }: NoteProps) {
  const ref = useRef<SVGElement | null>(null);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener("endEvent", () => {
      console.log("end");
      setEnd(true);
    });
  }, []);
  // useEffect(() => {
  //   if (!ref.current) return;
  //   console.log(note);

  //   d3.select(ref.current)
  //     .attr("x", 195)
  //     .attr("y", 20)
  //     .attr("width", "10")
  //     .attr("height", "10")
  //     .attr("fill", "blue")
  //     .transition()
  //     .duration(note.duration + 10000)
  //     .delay(note.time)
  //     .attr("x", 195)
  //     .attr("y", 300)
  //     .remove();
  // }, [note]);

  return note && !end ? (
    <rect className="note" x={195} y={-20} width={10} height={10} fill="red">
      <animate
        ref={ref}
        attributeType="XML"
        attributeName="y"
        from="-20"
        to="300"
        dur="3s"
      />
    </rect>
  ) : null;
}

export default NotesViz;
