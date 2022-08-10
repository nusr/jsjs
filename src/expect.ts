class Expect {
  total = 0;
  success = 0;
  private list: string[] = [];
  assert(actual: string) {
    this.total++;
    if (this.list.length > 0) {
      const expect = this.list.pop();
      if (actual === expect) {
        this.success++;
      }
    }
  }
  addCase(expect: string) {
    this.list.unshift(expect);
  }
}
const globalExpect = new Expect();
export default globalExpect;
