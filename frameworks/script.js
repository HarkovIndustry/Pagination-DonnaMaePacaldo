document.addEventListener("DOMContentLoaded", () => {
  const $navbarBurgers = document.querySelectorAll(".navbar-burger");
  $navbarBurgers.forEach(($el) => {
    $el.addEventListener("click", () => {
      const target = $el.dataset.target;
      const $target = document.getElementById(target);
      $el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 1; // Adjust this value for more items per page
  let currentPage = 1;

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationList = document.getElementById("pagination-list");
    paginationList.innerHTML = "";

    // Handle Previous button
    const prevButton = document.querySelector(".pagination-previous");

    function handlePrevClick() {
      if (currentPage > 1) {
        currentPage--;
        renderDestinations();
        renderPagination(totalItems);
        updateActivePage();
      }
    }

    prevButton.addEventListener("click", handlePrevClick);
    prevButton.disabled = currentPage === 1;

    // Handle Next button
    const nextButton = document.querySelector(".pagination-next");

    function handleNextClick() {
      if (currentPage < totalPages) {
        currentPage++;
        renderDestinations();
        renderPagination(totalItems);
        updateActivePage();
      }
    }

    nextButton.addEventListener("click", handleNextClick);
    nextButton.disabled = currentPage === totalPages;

    // Update active page
    function updateActivePage() {
      const paginationLinks = document.querySelectorAll(".pagination-link");
      paginationLinks.forEach((link) => {
        link.classList.remove("is-current");
        if (link.getAttribute("data-page") == currentPage)
          link.classList.add("is-current");
      });
      updateButtonStates();
    }

    // Update disabled state on page change
    function updateButtonStates() {
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
    }

    // Call updateButtonStates after rendering pagination
    function renderPagination(totalItems) {
      updateActivePage();
    }

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#anchorPagination" class="pagination-link ${
        i === currentPage ? "is-current" : ""
      }" aria-label="Goto page ${i}" data-page="${i}">${i}</a>`;
      paginationList.appendChild(li);
    }

    document.querySelectorAll(".pagination-link").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        currentPage = parseInt(this.getAttribute("data-page"));
        renderDestinations();
        renderPagination(totalItems);
      });
    });
  }

  function renderDestinations() {
    const container = document.querySelector("#destination .container");
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = details.slice(start, end);

    paginatedItems.forEach((detail) => {
      const placeElement = document.createElement("div");
      placeElement.innerHTML = `
                <h2 class="title has-centered">${detail.place}</h2>
                <div class="columns is-multiline is-centered">
                    ${detail.images
                      .map(
                        (image) => `
                          <div class="column is-half-mobile is-one-third-tablet is-one-fifth-desktop">
                          <figure class="image is-1by1 image-centered ">
                          <img src="${detail.imagePath}${detail.place}/${image}" class="is-rounded img-thumbnail img-fluid image-mobile-width" data-img="${detail.imagePath}${detail.place}/${image}">
                          </figure>
                          </div>`
                      )
                      .join("")}
                </div>
                <div class="content">
                    <p>${detail.description}</p>
                    <div class="has-text-centered">
                        <button class="button is-info" data-view-more="${
                          detail.place
                        }">View More</button>
                    </div>
                </div>`;
      container.appendChild(placeElement);
    });

    document.querySelectorAll("[data-view-more]").forEach((button) => {
      button.addEventListener("click", function () {
        const detail = details.find(
          (d) => d.place === this.getAttribute("data-view-more")
        );
        const moreDetailsModalBody = document.getElementById(
          "moreDetailsModalBody"
        );
        moreDetailsModalBody.innerHTML = `
                    <p><strong>Address:</strong> ${detail.buttonDirectory.address.location}</p>
                    <p><strong>Fee:</strong> ${detail.buttonDirectory.fee}</p>
                    <p><strong>Contact Number:</strong> ${detail.buttonDirectory.contact}</p>
                    <hr>
                    <div>
                        <iframe src="${detail.buttonDirectory.address.map}" class="mx-auto" width="90%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>`;
        document.getElementById("moreDetailsModal").classList.add("is-active");
      });
    });

    document.querySelectorAll("[data-img]").forEach((image) => {
      image.addEventListener("click", function () {
        document.getElementById("modalImage").src =
          this.getAttribute("data-img");
        document.getElementById("imageModal").classList.add("is-active");
      });
    });
  }

  document
    .querySelectorAll(".modal-close, .modal-background, .delete")
    .forEach((el) => {
      el.addEventListener("click", function () {
        el.closest(".modal").classList.remove("is-active");
      });
    });

  document.getElementById("viewMap").addEventListener("click", function () {
    const place = document
      .querySelector("[data-view-more]")
      .getAttribute("data-view-more");
    const query = encodeURIComponent(place);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  });

  document.getElementById("contactNow").addEventListener("click", function () {
    Swal.fire({
      title: "Contact",
      text: `Contact Number: ${
        details.find(
          (d) =>
            d.place ===
            document
              .querySelector("[data-view-more]")
              .getAttribute("data-view-more")
        ).buttonDirectory.contact
      }`,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "Copy Number",
      cancelButtonText: "Call",
      preConfirm: () => {
        navigator.clipboard.writeText(
          details.find(
            (d) =>
              d.place ===
              document
                .querySelector("[data-view-more]")
                .getAttribute("data-view-more")
          ).buttonDirectory.contact
        );
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = `tel:${
          details.find(
            (d) =>
              d.place ===
              document
                .querySelector("[data-view-more]")
                .getAttribute("data-view-more")
          ).buttonDirectory.contact
        }`;
      }
    });
  });

  renderPagination(details.length);
  renderDestinations();
});
