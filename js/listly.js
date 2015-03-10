var Listly = function() {

  function Listly() {
    var self = this;
    self.tasks = [];

    function load() {
      self.tasks = JSON.parse(localStorage.tasks);
      $.each(self.tasks, function(index, name) {
        $('#tasks').append('<li class="list-group-item">' + name + '</li>');
      });
    }

    function addTask(name) {
      self.tasks.push(name);
      if (save()) {
        $('#tasks').append('<li class="list-group-item">' + name + '</li>');
        return true;
      } else {
        return false;
      }
    }

    function save() {
      console.log("Add storage");

      if ("localStorage" in window) {
        try {
          return (localStorage.tasks = JSON.stringify(self.tasks));
        } catch (err) {
          return false;
        }
      } else {
        alert("no localStorage in window");
        return false;
      }
    }

    load();

    $('form#new_task').submit(function(ev) {
      ev.preventDefault();
      var field = $(this.task_name);
      var task_name = field.val();

      if (addTask(task_name)) {
        field.val('');
      }
      field.focus().select();
    });
  }

  return Listly;
}();

var listly = new Listly();
