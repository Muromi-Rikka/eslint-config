import React from "react";

const PATTERN = /\.\d+/g;

export function HelloWorld({
  greeted = "\"World\"",
  greeting = "hello",
  onMouseOver,
  silent = false,
}) {
  const [number_] = React.useState(() => Math
    .floor (Math.random() * 1e+7)
    .toString()
    .replaceAll(PATTERN, ""));

  if (!greeting) {
    return null;
  };

  return (
    <div className="HelloWorld" title={`You are visitor number ${number_}`} onMouseOver={onMouseOver}>
      <strong>{ greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase() }</strong>
      {greeting.endsWith(",")
        ? " "
        : <span style={{ color: "\grey" }}>", "</span> }
      <em>
        { greeted }
      </em>
      { (silent) ? "." : "!"}
    </div>
  );
}
