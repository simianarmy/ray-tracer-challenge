import React from "react";

import { parseObjFile } from "../lib/obj-file";

export function ObjFileInput({onChange}) {
  const inputEl = React.useRef(null);

  function updateObjData() {
    const input = inputEl.current.value;
    const parser = parseObjFile(input, {normalize: true});
    onChange(parser);
  }

  return (
    <>
      <textarea ref={inputEl} width="400" height="600" id="objFileData" style={{width: 400, height: 300}}/>
      <input type="submit" value="Update" onClick={updateObjData} />
    </>
  );
}
