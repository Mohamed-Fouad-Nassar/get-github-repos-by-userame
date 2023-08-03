let userNameInput = document.getElementById("username");
let submitBtn = document.getElementById("submit");
let dataDiv = document.getElementById("data");

async function fetchData(apiLink) {
  try {
    let apiFetch = await fetch(apiLink);
    let data = await apiFetch.json();
    return data;
  } catch (reason) {
    throw new Error(reason);
  } finally {
    console.log("fetch data is done");
  }
}

function createInfoSection(arr) {
  let infoSection = document.createElement("section");
  infoSection.classList.add("info");

  // image div
  let imageDiv = document.createElement("div");
  imageDiv.classList.add("image");
  let image = document.createElement("img");
  image.src = arr[1].owner.avatar_url;
  image.alt = "user avatar";
  imageDiv.appendChild(image);

  // name section
  let nameDiv = document.createElement("div");
  nameDiv.classList.add("name");
  let userName = document.createElement("a");
  userName.href = arr[1].owner.html_url;
  userName.appendChild(document.createTextNode(arr[1].owner.login));
  nameDiv.appendChild(userName);

  // repositories number section
  let reposNumberDiv = document.createElement("div");
  reposNumberDiv.classList.add("repos-num");
  let title = document.createElement("p");
  title.appendChild(document.createTextNode("repos number"));
  reposNumberDiv.appendChild(title);
  let number = document.createElement("span");
  number.appendChild(document.createTextNode(arr.length));
  reposNumberDiv.appendChild(number);

  // append elements to the info section
  infoSection.appendChild(imageDiv);
  infoSection.appendChild(nameDiv);
  infoSection.appendChild(reposNumberDiv);

  // append info section to the data div
  dataDiv.prepend(infoSection);
}

function createReposSection(arr) {
  let reposSection = document.createElement("section");
  reposSection.classList.add("repos");

  // create repo articles
  arr.forEach((e) => {
    let repoArticle = document.createElement("article");
    repoArticle.classList.add("repo");

    // repo title
    let repoTitle = document.createElement("a");
    repoTitle.appendChild(document.createTextNode(removeSpecialChars(e.name)));
    repoTitle.href = e.html_url;
    repoArticle.appendChild(repoTitle);

    // repo description
    let repoDescription = document.createElement("p");
    repoDescription.appendChild(document.createTextNode(e.description));
    repoArticle.appendChild(repoDescription);

    // foot section div
    let footSection = document.createElement("div");
    footSection.classList.add("foot-sec");

    // size section
    let size = document.createElement("div");
    size.classList.add("flex-half");
    size.innerHTML = `<i class="f-icon fa-solid fa-download"></i>`;
    size.appendChild(document.createTextNode(`${KBToMB(e.size)} MB`));
    footSection.appendChild(size);

    // watches section
    let watches = document.createElement("div");
    watches.classList.add("flex-half");
    watches.innerHTML = `<i class="f-icon fa-solid fa-eye"></i>`;
    watches.appendChild(document.createTextNode(e.watchers_count));
    footSection.appendChild(watches);

    // stars section
    let stars = document.createElement("div");
    stars.classList.add("flex-half");
    stars.innerHTML = `<i class="f-icon fa-solid fa-star"></i>`;
    stars.appendChild(document.createTextNode(e.stargazers_count));
    footSection.appendChild(stars);

    // forks section
    let forks = document.createElement("div");
    forks.classList.add("flex-half");
    forks.innerHTML = `<i class="f-icon fa-solid fa-code-fork"></i>`;
    forks.appendChild(document.createTextNode(e.forks_count));
    footSection.appendChild(forks);
    // append foot section to repo article
    repoArticle.appendChild(footSection);

    // links
    if (
      e.has_pages === true &&
      e.visibility === "public" &&
      e.homepage !== null
    ) {
      let linksDiv = document.createElement("div");

      // code in github link
      let codeLink = document.createElement("a");
      codeLink.appendChild(document.createTextNode("code in github"));
      codeLink.href = e.html_url;
      linksDiv.appendChild(codeLink);

      // live Demo link
      let liveDemoLink = document.createElement("a");
      liveDemoLink.appendChild(document.createTextNode("Live Demo"));
      liveDemoLink.href = e.homepage;
      linksDiv.appendChild(liveDemoLink);

      // append links div to repo article
      repoArticle.appendChild(linksDiv);
    }

    // dates
    let createdDate = document.createElement("span");
    createdDate.appendChild(
      document.createTextNode(
        `created on ${new Date(e.created_at)
          .toLocaleString()
          .replace(",", " at")}`
      )
    );
    repoArticle.appendChild(createdDate);
    let updatedDate = document.createElement("span");
    updatedDate.appendChild(
      document.createTextNode(
        `last update on ${new Date(e.updated_at)
          .toLocaleString()
          .replace(",", " at")}`
      )
    );
    repoArticle.appendChild(updatedDate);

    // append repo article to the repos section
    reposSection.appendChild(repoArticle);
  });

  // append repo section to the data div
  dataDiv.append(reposSection);
}

function removeSpecialChars(str) {
  return str.replace(/(-|_)/gim, " ");
}

function KBToMB(KB) {
  return (KB * 0.001024).toFixed(2);
}

// for testing
let userNamesToTest = [
  "Mohamed-Fouad-Nassar",
  "bregman-arie",
  "knoxknot",
  "cloudgrimm",
  "zdj21jdz",
  "Rahulsharma0810",
  "chimons",
  "susenj",
  "adrianfusco",
  "osamaelzero",
  "elzerowebschool",
];

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dataDiv.style.display = "none";
  dataDiv.innerHTML = "";
  if (userNameInput.value.length <= 0) {
    dataDiv.style.display = "none";
  } else {
    dataDiv.style.display = "block";
    fetchData(`https://api.github.com/users/${userNameInput.value}/repos`).then(
      (result) => {
        createInfoSection(result);
        createReposSection(result);
      }
    );
  }
  userNameInput.value = "";
});
