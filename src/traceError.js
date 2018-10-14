export default function traceError(e = new Error()) {
  // For Internet Explorer only
  if (!e.stack)
    return {
      file: undefined,
      line: undefined,
      column: undefined,
      backtrace: undefined
    };

  const backtrace = e.stack.toString();
  const stack = backtrace.split(/\r\n|\n/);
  const regex = /(http.*):(\d+):(\d+)/;
  const frame = stack.find(msg => regex.test(msg));
  if (!frame)
    return {
      file: undefined,
      line: undefined,
      column: undefined,
      backtrace: undefined
    };
  const [_, file, line, column] = regex.exec(frame); // eslint-disable-line no-unused-vars
  return {
    file,
    line,
    column,
    backtrace
  };
}
