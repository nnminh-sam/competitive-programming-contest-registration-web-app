// * This function clear the value of the input element via Backspace key
async function forceClearInput(input: any) {
  const value = await input.getAttribute("value");
  for (let i = 0; i < value.length; i++) {
    await input.sendKeys("\u0008");
  }
}

// * Helper function to pause execution
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { forceClearInput, sleep };
