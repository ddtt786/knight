/**
 * @param {HTMLElement} contents
 */
async function range(contents) {
  const block = (await browser.storage.local.get()).block;
  const list = [...contents.querySelectorAll("ul > li[class]")];
  //이미지 업로드 버튼
  if (!contents.querySelector("#genimg")) {
    const genimg = document.createElement("a");
    genimg.id = "genimg";
    genimg.role = "button";
    genimg.addEventListener("click", () => {
      upload().then((d) => {
        navigator.clipboard.writeText(
          `https://playentry.org/uploads/${d.id.slice(0, 2)}/${d.id.slice(
            2,
            4
          )}/${d.id}.${d.ext}`
        );
      });
    });
    contents.querySelectorAll("div>a")[2].after(genimg);
  }

  list.forEach((post) => {
    const link = post.querySelectorAll("div > a")[2];
    const url = link.href;
    const user = post
      .querySelector("li > div > a")
      .href.match(/[a-f\d]{24}/)[0];
    const blocked = block.includes(user);

    if ([...post.querySelectorAll("ul > li > .block")].length != 0) return;

    //차단 버튼
    const menu = document.createElement("li");
    post.querySelector("ul").append(menu);
    const blockButton = document.createElement("a");
    blockButton.className = "block";
    blockButton.innerText = blocked ? "차단해제" : "차단하기";
    blockButton.addEventListener("click", () => {
      if (blocked) {
        chrome.storage.local.set({ block: block.filter((u) => u !== user) });
        try {
          menu.remove();
          box.remove();
        } catch (e) {
        } finally {
          range(contents);
        }
      } else {
        block.push(user);
        browser.storage.local.set({ block });
        try {
          menu.remove();
          box.remove();
          range(contents);
        } catch (e) {
        } finally {
          range(contents);
        }
      }
    });
    menu.append(blockButton);

    if (
      !url.startsWith("https://playentry.org/uploads/") ||
      link.parentElement.querySelector("img")
    )
      return;
    link.innerText = "";

    const box = document.createElement("div");
    box.className = "imgbox";
    link.append(box);
    const image = document.createElement("img");
    image.src = link.href;

    if (!blocked) {
      box.append(image);
    } else {
      box.innerText = "차단된 유저입니다.";
    }
  });
}
