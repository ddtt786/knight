browser.storage.local.get().then(({ block }) => {
  console.log(block);
  if (Object.keys(block).length === 0) {
    browser.storage.local.set({ block: [] });
  }
});

const observer = new MutationObserver(() => {
  const contents = document.querySelector(".nextInner section");
  if (!contents) return;
  if ([...contents.querySelectorAll("ul > li[class]")].length >= 10)
    range(contents);
});

observer.observe(document.querySelector("body"), {
  childList: true,
  subtree: true,
});
