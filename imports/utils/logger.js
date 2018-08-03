export default Logger = {
  log() {
    const args = Array.from(arguments);
    console.log(...args);
  }
}
