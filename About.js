// Example JS for breadcrumb hover effect
document.addEventListener("DOMContentLoaded", () => {
  const breadcrumbItems = document.querySelectorAll(".breadcrumb span");

  breadcrumbItems.forEach(item => {
    item.addEventListener("mouseover", () => {
      item.style.textDecoration = "underline";
    });
    item.addEventListener("mouseout", () => {
      item.style.textDecoration = "none";
    });
  });
});
