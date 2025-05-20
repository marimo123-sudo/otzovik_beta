document.addEventListener("click", (e) => {
    const clickedButton = e.target.closest("button");

    if (clickedButton?.id === "search") {
        // window.location.href = "/search.html";
    } else if (clickedButton?.id === "create") {
        window.location.href = "create_product/create_product.html";
    } else if (clickedButton?.id === "profile") {
        window.location.reload();
    }
});