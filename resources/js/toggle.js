function toggleActive(elem){
  elem.classList.toggle('active');
}

document.getElementById('menu__toggle').onclick = function() {
  toggleActive(this);
}
