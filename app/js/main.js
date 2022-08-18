// смена вкладок блоков
const sidebar = document.getElementById('sidebar');
const wrapper = document.getElementById('wrapper');
const sidebarButton = document.getElementById('sidebarButton');
const wrapperButton = document.getElementById('wrapperButton');

sidebarButton.onclick = function() {
    wrapper.style.display="none";
    sidebar.style.display="block";
}
wrapperButton.onclick = function() {
    sidebar.style.display="none";
    wrapper.style.display="block";
}
