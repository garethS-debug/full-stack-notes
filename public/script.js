document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");
  const API_BASE = window.location.origin.includes("3004")
    ? window.location.origin
    : "http://localhost:3004";
  const DATA_ENDPOINT = `${API_BASE}/data`;

  const fetchData = async () => {
    try {
      const response = await fetch(DATA_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        const editButton = document.createElement("button"); // this is edit 
        const deleteButton = document.createElement("button"); 

        li.dataset.id = item.id;
        text.textContent = item.text ?? "";
        //Edit button
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = item.id; 
        //Delete
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = item.id;

        li.appendChild(text);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        dataList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle form submission to add new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };

    try {
      const response = await fetch(DATA_ENDPOINT, {
        method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      } else {
        throw new Error(`Failed to add data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

    // Handle form submission to delete data
  dataList.addEventListener("click", async (event) => {
    // event.preventDefault();
    // const newData = { text: dataInput.value };
  const target = event.target;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === "delete") {
    try {
      const response = await fetch(`${DATA_ENDPOINT}/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      } else {
        throw new Error(`Failed to delete data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
       return;
  }
 if (action === "edit") {
    const li = target.closest("li");
    const textSpan = li.querySelector("span");

    const currentText = textSpan.textContent;
     const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className = "edit-input";

        // create save button
    const save = document.createElement("button");
    save.type = "button";
    save.textContent = "Save";
    save.className = "save";
     save.dataset.action = "save"; 
      save.dataset.id = li.dataset.id; 

       // add to page
    li.appendChild(input);
    li.appendChild(save);

 }

 if (action === "save") {
    const li = target.closest("li");
    const input = li.querySelector(".edit-input");
    const id = li.dataset.id;
    const newText = input.value;  

    try {
      const response = await fetch(`${DATA_ENDPOINT}/put/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      if (response.ok) {
        // dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      } else {
        throw new Error(`Failed to delete data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
       return;
 }

 
});
 fetchData();
//       // Handle form submission to editing data
//   dataList.addEventListener("click", async (event) => {
//     const target = event.target;
//     if (target.dataset.action !== "edit") return;
//     const id = target.dataset.id;

//     const currentText = target.previousSibling.textContent;
//     // const newText = prompt("Edit the text:", currentText);
   


//  save.addEventListener("click", async () => {
//       const newText = input.value;
//     try {
//       const response = await fetch(`${DATA_ENDPOINT}/put/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: newText }),
//       });

//       if (response.ok) {
//         // dataInput.value = ""; // Clear input field
//         fetchData(); // Refresh the list
//       } else {
//         throw new Error(`Failed to put data: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error putting data:", error);
//     }
//     });
//   });
  


  // Fetch data on page load


});

