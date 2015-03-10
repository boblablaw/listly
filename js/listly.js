var Listly = function() {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(name) {
      self.tasks.push(name);
      if (save()) {
        $('#tasks').append('<li class="list-group-item">' + name + '</li>');
        return true;
      } else {
        return false;
      }
    }

    function showFormError(form) {
      $(form).find('.alert')
        .html('<em>Yo dawg<em>, we screwed up!')
        .removeClass('hidden');
    }

    function supportsLocalStorage() {
      try {
        // undefined.something;
        return 'localStorage' in window && window.localStorage !== null;
      } catch (err) {
        return false;
      }
    }

    function load() {
      if (supportsLocalStorage() && localStorage.tasks) {
        self.tasks = JSON.parse(localStorage.tasks);
        $.each(self.tasks, function(index, name) {
          $('#tasks').append('<li class="list-group-item">' + name + '</li>');
        });
      }
    }

    function save() {
      if (supportsLocalStorage()) {
        return (localStorage.tasks = JSON.stringify(self.tasks));
      } else {
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
      } else {
        showFormError(this);
      }
      field.focus().select();
    });
  }

  return Listly;
}();

var listly = new Listly();
