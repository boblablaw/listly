var Listly = function () {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      self.tasks.push(task_name);

      if (save()) {
        appendToList(task_name);
        return true;
      } else {
        return false;
      }
    }

    function appendToList(task_name) {
      // Grab the list item template

      var li = $('#list_item_template').clone();
      li.removeAttr('id');
      
      li.find('label').text(task_name);
      li.removeClass('hidden');

      li.find('.btn-danger').click(function() {
        removeFromList(task_name);
        // Remove it from the <ol>
        li.remove();
      });

      $('#tasks').append(li);
    }

    function removeFromList(task_name) {
      self.tasks.splice(self.tasks.indexOf(task_name), 1);
      save();
    }

    function showFormError(form) {
      $(form).find('.alert')
        .html('<em>Yo dawg<em>, we screwed up!')
        .removeClass('hidden');
    }

    function removeFormError(form) {
      $(form).addClass('hidden');
    }

    function supportsLocalStorage() {
      try {
        return 'localStorage' in window && window.localStorage !== null;
      } catch (err) {
        return false;
      }
    }

    function load() {
      if (supportsLocalStorage() && localStorage.tasks) {
        self.tasks = JSON.parse(localStorage.tasks);
        $.each(self.tasks, function(index, task_name) {
          appendToList(task_name);
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
         // setTimeout(showFormError(this), 3000);
         // removeFormError(this);
      }
      field.focus().select();
    });
  }

  return Listly;
}();

var listly = new Listly();
