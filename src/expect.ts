class Expect {
  total = 0;
  success = 0;
  add() {
    this.total++;
  }
  addSuccess() {
    this.success++;
  }
}
const globalExpect = new Expect();
export default globalExpect;
