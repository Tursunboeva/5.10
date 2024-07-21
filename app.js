const $products = document.querySelector("#products");
const $createForm = document.querySelector("#createForm");
const $inputs = $createForm.querySelectorAll(".inputElement");
const $update = document.querySelector("#updateForm");
const $updateInputs = $update.querySelectorAll(".inputElement");

function loadData() {
    fetch("https://6662ac4162966e20ef097175.mockapi.io/api/products/products")
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Error loading products:', error));
}

loadData();

const renderProducts = (products) => {
    products.forEach(product => {
        const $div = document.createElement("div");
        $div.className = "card";
        $div.innerHTML = `
            <div><img src="${product.image}"/></div><br>
            <div class="cards">
                <b class="title">${product.title} </b>
                <p><b>Description:</b> ${product.description}</p>
                <p><b>Price:</b> ${product.price}</p>
                <p><b>Discount:</b> ${product.discount}</p>
                <p>${product.createdAt}</p>
                <button data-product-id="${product.id}" class="update">Update</button>
                <button data-product-id="${product.id}" class="delete">Delete</button>
            </div>`;
        $products.appendChild($div);
    });
}

const handleCreateNewProduct = (e) => {
    e.preventDefault();
    const values = Array.from($inputs).map(input => input.value);
    let product = {
        title: values[0],
        image: values[1],
        discount: values[2],
        description: values[3]
    };

    fetch("https://6662ac4162966e20ef097175.mockapi.io/api/products/products", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        console.log("New product created:", data);
        window.location.reload();
    })
    .catch(error => console.error('Error creating new product:', error));
};

const handleUpdateProduct = (e) => {
    e.preventDefault();
    const values = Array.from($updateInputs).map(input => input.value);
    let product = {
        title: values[0],
        image: values[1],
        discount: values[2],
        description: values[3]
    };

    const id = $update.dataset.currentUpdateProductId;
    fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Product updated:", data);
        window.location.reload();
    })
    .catch(error => console.error('Error updating product:', error));
};

const handleFillUpdateForm = (e) => {
    if (e.target.classList.contains("update")) {
        const id = e.target.dataset.productid;
        fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`)
        .then(response => response.json())
        .then(data => {
            $updateInputs[0].value = data.title;
            $updateInputs[1].value = data.image;
            $updateInputs[2].value = data.discount;
            $updateInputs[3].value = data.description;
            $update.dataset.currentUpdateProductId = id;
        })
        .catch(error => console.error('Error fetching product data:', error));
    }
};

const handleDeleteProduct = (e) => {
    if (e.target.classList.contains("delete")) {
        const id = e.target.dataset.productid;
        const userAgree = confirm("Are you sure you want to delete this product?");
        if (userAgree) {
            fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete product with id ${id}`);
                }
                console.log(`Product with id ${id} deleted successfully.`);
                return response.json();
            })
            .then(data => {
                console.log(data); // log the response from the server if needed
                window.location.reload(); // reload the page after deletion
            })
            .catch(error => console.error('Error deleting product:', error));
        }
    }
};

$products.addEventListener("click", handleDeleteProduct);
$createForm.addEventListener("submit", handleCreateNewProduct);
$update.addEventListener("submit", handleUpdateProduct);
$products.addEventListener("click", handleFillUpdateForm);
