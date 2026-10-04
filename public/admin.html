<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <title>Sir Mahee Admin</title>

  <link
    rel="stylesheet"
    href="/style.css"
  >
</head>

<body>

  <nav>
    <b>🔐 Sir Mahee Admin</b>

    <a href="/">
      Student Website
    </a>
  </nav>

  <main class="admin">

    <!-- ================= LOGIN ================= -->

    <section
      id="loginSection"
      class="glass panel"
    >

      <h1>Admin Login</h1>

      <input
        id="email"
        type="email"
        placeholder="Email"
        autocomplete="username"
      >

      <input
        id="password"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
      >

      <button
        id="loginButton"
        type="button"
      >
        Login
      </button>

      <p id="loginMessage"></p>

    </section>


    <!-- ================= DASHBOARD ================= -->

    <section
      id="dashboard"
      style="display:none"
    >

      <div class="glass panel">

        <div class="row">

          <div>
            <h1>📤 Content Manager</h1>

            <p>
              Upload and manage your study material.
            </p>
          </div>

          <button
            id="logoutButton"
            class="btn"
            type="button"
          >
            Logout
          </button>

        </div>


        <!-- ================= UPLOAD FORM ================= -->

        <form
          id="materialForm"
          enctype="multipart/form-data"
        >

          <div class="two">

            <label>
              Title

              <input
                name="title"
                required
                placeholder="Tenses — Complete Notes"
              >
            </label>


            <label>
              Class

              <select name="className">

                <option>All Classes</option>

                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>

              </select>

            </label>


            <label>
              Subject

              <select name="subject">

                <option>English</option>
                <option>Hindi</option>
                <option>Maths</option>
                <option>Science</option>
                <option>Social Science</option>
                <option>Rajasthan GK</option>
                <option>Competitive Exams</option>
                <option>Other</option>

              </select>

            </label>


            <label>
              Type

              <select name="type">

                <option>Notes</option>
                <option>PDF</option>
                <option>Worksheet</option>
                <option>Question Paper</option>
                <option>Video</option>
                <option>Audio</option>
                <option>Image</option>
                <option>Other</option>

              </select>

            </label>


            <label>
              Chapter

              <input
                name="chapter"
                placeholder="Grammar / Tenses"
              >

            </label>


            <label>
              Description

              <textarea
                name="description"
                placeholder="Short description"
              ></textarea>

            </label>

          </div>


          <label>
            File

            <input
              name="file"
              type="file"
              required
            >
          </label>


          <button
            class="btn"
            type="submit"
          >
            Upload Material
          </button>

          <p id="uploadMessage"></p>

        </form>

      </div>


      <!-- ================= MATERIALS ================= -->

      <div class="glass panel">

        <h2>
          📚 Uploaded Materials
        </h2>

        <div id="items">
          Loading...
        </div>

      </div>

    </section>

  </main>


<script>

"use strict";


/* =========================
   ELEMENTS
========================= */

const loginSection =
  document.getElementById("loginSection");

const dashboard =
  document.getElementById("dashboard");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const loginButton =
  document.getElementById("loginButton");

const logoutButton =
  document.getElementById("logoutButton");

const loginMessage =
  document.getElementById("loginMessage");

const materialForm =
  document.getElementById("materialForm");

const uploadMessage =
  document.getElementById("uploadMessage");

const items =
  document.getElementById("items");


/* =========================
   API HELPER
========================= */

async function apiFetch(url, options = {}) {

  const response = await fetch(
    url,
    {
      ...options,

      credentials: "include"
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  return {
    response,
    data
  };
}


/* =========================
   CHECK LOGIN
========================= */

async function checkLogin() {

  try {

    const { response, data } =
      await apiFetch("/api/me");

    if (
      response.ok &&
      data.loggedIn === true
    ) {

      showDashboard();

      await loadMaterials();

    } else {

      showLogin();

    }

  } catch (error) {

    showLogin();

    loginMessage.textContent =
      "Server से connection नहीं हो रहा।";

  }
}


/* =========================
   SHOW LOGIN
========================= */

function showLogin() {

  loginSection.style.display = "block";

  dashboard.style.display = "none";

}


/* =========================
   SHOW DASHBOARD
========================= */

function showDashboard() {

  loginSection.style.display = "none";

  dashboard.style.display = "block";

}


/* =========================
   LOGIN
========================= */

async function login() {

  const email =
    emailInput.value.trim().toLowerCase();

  const password =
    passwordInput.value;


  if (!email || !password) {

    loginMessage.textContent =
      "Email और Password दोनों भरें।";

    return;

  }


  loginButton.disabled = true;

  loginButton.textContent =
    "Logging in...";

  loginMessage.textContent = "";


  try {

    const { response, data } =
      await apiFetch(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );


    if (
      response.ok &&
      data.ok === true
    ) {

      emailInput.value = "";
      passwordInput.value = "";

      loginMessage.textContent =
        "Login successful ✓";

      showDashboard();

      await loadMaterials();

    } else {

      loginMessage.textContent =
        data.error ||
        "Login failed.";

    }

  } catch (error) {

    loginMessage.textContent =
      "Server से connection नहीं हो रहा।";

    console.error(error);

  } finally {

    loginButton.disabled = false;

    loginButton.textContent =
      "Login";

  }

}


/* =========================
   LOGOUT
========================= */

async function logout() {

  try {

    await apiFetch(
      "/api/logout",
      {
        method: "POST"
      }
    );

  } catch (error) {

    console.error(error);

  }

  showLogin();

}


/* =========================
   UPLOAD
========================= */

async function uploadMaterial(event) {

  event.preventDefault();

  uploadMessage.textContent =
    "Uploading...";


  const formData =
    new FormData(materialForm);


  try {

    const { response, data } =
      await apiFetch(
        "/api/materials",
        {
          method: "POST",
          body: formData
        }
      );


    if (response.ok && data.ok) {

      uploadMessage.textContent =
        "Uploaded ✓";

      materialForm.reset();

      await loadMaterials();

    } else {

      uploadMessage.textContent =
        data.error ||
        "Upload failed.";

    }

  } catch (error) {

    console.error(error);

    uploadMessage.textContent =
      "Upload के दौरान error आया।";

  }

}


/* =========================
   LOAD MATERIALS
========================= */

async function loadMaterials() {

  items.innerHTML =
    "<p>Loading materials...</p>";


  try {

    const { response, data } =
      await apiFetch(
        "/api/materials"
      );


    if (!response.ok) {

      items.innerHTML =
        "<p>Materials load नहीं हो पाए।</p>";

      return;

    }


    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {

      items.innerHTML =
        "<p>No materials yet.</p>";

      return;

    }


    items.innerHTML =
      data
        .map(material => {

          const title =
            escapeHtml(
              material.title
            );

          const subject =
            escapeHtml(
              material.subject || ""
            );

          const className =
            escapeHtml(
              material.class_name || ""
            );

          const type =
            escapeHtml(
              material.type || ""
            );

          const storedName =
            encodeURIComponent(
              material.stored_name || ""
            );


          return `
            <div class="item glass">

              <b>${title}</b>

              <span>
                ${subject}
                • Class ${className}
                • ${type}
              </span>

              <a
                href="/uploads/${storedName}"
                target="_blank"
                rel="noopener"
              >
                Open
              </a>

              <button
                type="button"
                onclick="deleteMaterial(${material.id})"
              >
                Delete
              </button>

            </div>
          `;

        })
        .join("");


  } catch (error) {

    console.error(error);

    items.innerHTML =
      "<p>Server से materials load नहीं हुए।</p>";

  }

}


/* =========================
   DELETE
========================= */

async function deleteMaterial(id) {

  const confirmed =
    confirm(
      "Delete this material?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const { response, data } =
      await apiFetch(
        "/api/materials/" + id,
        {
          method: "DELETE"
        }
      );


    if (response.ok && data.ok) {

      await loadMaterials();

    } else {

      alert(
        data.error ||
        "Delete failed."
      );

    }

  } catch (error) {

    console.error(error);

    alert(
      "Delete करते समय server error आया।"
    );

  }

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      function(match) {

        const map = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"

        };

        return map[match];

      }
    );

}


/* =========================
   EVENTS
========================= */

loginButton.addEventListener(
  "click",
  login
);

logoutButton.addEventListener(
  "click",
  logout
);

materialForm.addEventListener(
  "submit",
  uploadMaterial
);


/*
  Allow Enter key to login.
*/

passwordInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      event.preventDefault();

      login();

    }

  }
);


/* =========================
   START
========================= */

checkLogin();

</script>

</body>
</html>
