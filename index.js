import { readFileSync } from "fs";

const log = (str) => console.log(str);

log(init());
function init() {
  const file = readFileSync("hello.sp", "utf-8");
  return parse(file);
}

function parse(file) {
  file = file.replaceAll("done", "}");
  file = parseStatement(
    file,
    /(in|de)crease\s+.*by\s+.*/g,
    (c) => c[1] + (c[0] == "increase" ? "+" : "-") + "=" + c[3]
  );

  file = file.replaceAll(/\s+(to|by|from)\s+/g, "");

  file = file.replaceAll(/\n\s*\n/g, "\n");

  file = parseStatement(file, /is\s+(less|greater)\s+than/g, (c) =>
    c[1] == "less" ? "<" : ">"
  );
  file = file.replaceAll(/is\s+equal/g, "==");
  file = file.replaceAll(/is\s+not\s+equal/g, "!=");

  file = file.replaceAll(/is|be/g, "=");
  file = file.replaceAll("added", "+");
  file = file.replaceAll("subtracted", "-");
  file = file.replaceAll("multiplied", "*");
  file = file.replaceAll("divided", "/");

  file = file.replaceAll("else", "}else");
  file = file.replaceAll(/else\s*\n/g, "else{\n");

  file = parseStatement(
    file,
    /(if|while)\s+.*/g,
    (c) => c[0] + " (" + c.slice(1).join(" ") + "){"
  );
  file = parseStatement(
    file,
    /print\s+.*/g,
    (c) => "console.log(" + c.slice(1).join(" ") + ")"
  );
  return file;
}

function parseStatement(file, regex, func) {
  const lines = file.match(regex);
  if (lines) {
    for (const line of lines) {
      const column = line.split(" ").filter(Boolean);
      file = file.replace(line, func(column));
    }
  }
  return file;
}

function semicolon(file) {
  const matches = file.match(/[^{}]\n/g);
  if (matches) {
    for (const line of matches) {
      file = file.replace(line, line.slice(0, -1) + ";\n");
    }
  }
  return file;
}
