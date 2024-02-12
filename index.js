document.addEventListener("DOMContentLoaded", () => {
  const services = [
    {
      id: 1,
      head: null,
      name: "Проф.осмотр",
      node: 0,
      price: 100.0,
      sorthead: 20,
    },
    {
      id: 2,
      head: null,
      name: "Хирургия",
      node: 1,
      price: 0.0,
      sorthead: 10,
    },
    {
      id: 3,
      head: 2,
      name: "Удаление зубов",
      node: 1,
      price: 0.0,
      sorthead: 10,
    },
    {
      id: 4,
      head: 3,
      name: "Удаление зуба",
      node: 0,
      price: 800.0,
      sorthead: 10,
    },
    {
      id: 5,
      head: 3,
      name: "Удаление 8ого зуба",
      node: 0,
      price: 1000.0,
      sorthead: 30,
    },
    {
      id: 6,
      head: 3,
      name: "Удаление осколка зуба",
      node: 0,
      price: 2000.0,
      sorthead: 20,
    },
    {
      id: 7,
      head: 2,
      name: "Хирургические вмешательство",
      node: 0,
      price: 200.0,
      sorthead: 10,
    },
    {
      id: 8,
      head: 2,
      name: "Имплантация зубов",
      node: 1,
      price: 0.0,
      sorthead: 20,
    },
    {
      id: 9,
      head: 8,
      name: "Коронка",
      node: 0,
      price: 3000.0,
      sorthead: 10,
    },
    {
      id: 10,
      head: 8,
      name: "Слепок челюсти",
      node: 0,
      price: 500.0,
      sorthead: 20,
    },
  ];

  const downSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
  </svg>`;
  const upSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
  </svg>`;

  function filterServices(services) {
    const serviceMap = {};
    const mainServices = [];

    services.forEach((service) => {
      service.children = [];
      serviceMap[service.id] = service;
    });

    services.forEach((service) => {
      if (service.head === null) {
        mainServices.push(service);
      } else {
        const parentService = serviceMap[service.head];
        if (parentService) {
          parentService.children.push(service);
        }
      }
    });

    return mainServices;
  }

  function sortServices(mainServices) {
    function recursiveFunc(services) {
      services.sort((a, b) => a.sorthead - b.sorthead);
      services.forEach((service) => {
        if (service.children.length > 0) {
          recursiveFunc(service.children);
        }
      });
    }

    recursiveFunc(mainServices);
  }

  const mainServices = filterServices(services);
  sortServices(mainServices);

  function renderDOM(mainServices, parentElement) {
    const ul = document.createElement("ul");

    mainServices.forEach((service) => {
      const li = document.createElement("li");
      li.textContent = `${service.name} ${
        service.price ? `(${service.price})` : ""
      }`;
      if (service.children.length > 0) {
        const span = document.createElement("span");
        span.innerHTML = downSvg;
        span.classList.add("toggle");
        li.appendChild(span);

        const childrenContainer = document.createElement("div");
        childrenContainer.setAttribute("data-name", service.name);
        childrenContainer.classList.add("children-container", "hidden");

        renderDOM(service.children, childrenContainer);
        li.appendChild(childrenContainer);

        li.addEventListener("click", (e) => {
          const element =
            e.target.nodeName === "svg"
              ? e.target.parentElement?.parentElement
              : e.target.nodeName === "path"
              ? e.target.parentElement?.parentElement?.parentElement
              : e.target;
          if (
            element &&
            element.children[1] &&
            childrenContainer.getAttribute("data-name") ===
              element.children[1].getAttribute("data-name")
          ) {
            childrenContainer.classList.toggle("hidden");
            span.innerHTML = childrenContainer.classList.contains("hidden")
              ? downSvg
              : upSvg;
          }
        });
      }

      ul.appendChild(li);
    });

    parentElement.appendChild(ul);
  }

  const treeContainer = document.getElementById("tree-container");
  renderDOM(mainServices, treeContainer);
});
