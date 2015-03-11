var Listly = function () {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      var task = new Task({ name: task_name })
      self.tasks.push(task);
      if (task_name !== '' && save()) {
          appendToList(task);
          return true;
      } else {
          return false;
      }
    }

    function appendToList(task) {
      var li, label;
      
      li = $('#list_item_template').clone();
      li.removeAttr('id').removeClass('hidden');
      li.addClass('task');
      li.attr('data-task-id', task.id);
      
      label = li.find('label');
      label.append(' ' + task.name);

      if (task.completed) {
        label.find('input[type=checkbox]').attr('checked', true);
        label.addClass('completed');
      }

      li.find('button.delete').click(task, removeFromList);
      li.find('button.edit').click(task, createEditForm); 
      li.find('input[type=checkbox]').change(toggleTaskCompletion);

      $('#tasks').append(li);
    }

    function toggleTaskCompletion(ev) {
      // this = checkbox
      var checkbox, task_id, task, label;
      
      checkbox = $(this);
      task_id = checkbox.closest('li.task').data('task-id');
      task = getTaskById(task_id);
      task.completed = checkbox.prop('checked');
      
      label = checkbox.closest('label');

      if (task.completed) {
        label.addClass('completed');
      } else {
        label.removeClass('completed');
      }
      
      save();
    }

    function createEditForm(ev) {
      var edit_form, name_field, task, li, label;
      
      task = ev.data;
      li = $(this).closest('li');
      label = li.find('label')

      edit_form = $('#edit_form_template').clone().removeAttr('id');
      edit_form.removeClass('hidden');
      edit_form.removeAttr('id');
      
      name_field = edit_form.find('.edit-task-name');
      name_field.attr('data-task-id', task.id).val(task.name);
      name_field.val(task.name);

      li.find('.btn-group').addClass('hidden');
      label.addClass('hidden');      
      edit_form.insertBefore(label);
      name_field.focus().select();
      //old process
      //li.find('label').replaceWith(edit_form);

      
      // Save and Cancel handlers
      edit_form.submit(updateTask);
      edit_form.find('button.cancel').click(function(ev) {
        removeEditForm(edit_form);
      });
    }

    function updateTask(ev) {
      //this = edit_form;
      ev.preventDefault();

      var field, id, task;

      field = $(this.elements.task_name);
      id = field.data('task-id');

      task = getTaskById(id)
      task.name = field.val();

      if (save()) {
        var label = $(this).siblings('label');
        var checkbox = label.find('input[type=checkbox]');
        $(this).siblings('label').text(' ' + field.val());

        removeEditForm(this);
      }
    }      

    function removeEditForm(form) {
      var label;
      form = $(form);

      label = form.siblings('label');
      field = form.find('.edit-task-name');

      label.removeClass('hidden');
      form.siblings('.btn-group').removeClass('hidden');
      form.remove();
    }

    function removeFromList(ev) {
      var task = ev.data;
      var item = this.closest('li')
      self.tasks.splice(self.tasks.indexOf(task), 1);
      item.remove();
      save()
    }

    function showFormError(form) {
      $(form).find('.alert')
        .html('<em>Yo dawg<em>, something\s up!!')
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
      var task_objects, task;
      
      if (supportsLocalStorage() && localStorage.tasks) {
        task_objects = JSON.parse(localStorage.tasks);
        task_objects.sort(function(a, b) {
          if (isNaN(a.position) || isNaN(b.position)) {
            return 0;
          }
          return a.position - b.position;
        });

        $.each(task_objects, function(index, task_properties) {
          task = new Task(task_properties);
          self.tasks.push(task);
          appendToList(task);
        });
      }
    }

    function updatePositions() {
      $('#tasks li.task').each(function(index){
        var task, id;
        id = $(this).data('task-id');
        task = getTaskById(id);
        task.position = index + 1;
      })
    }

    function getTaskById(id) {
      var task;

      $.each(self.tasks, function(index, current_task) {
        if (current_task.id == id) {
          task = current_task;
          return false;  // breaks out of the loop
        }
      });
      return task;
    }

    function save() {
      if (supportsLocalStorage()) {
        updatePositions();
        return (localStorage.tasks = JSON.stringify(self.tasks));
      } else {
        return false;
      }
    }

    load();

    $('form#new_task').submit(function(ev) {
      ev.preventDefault();
      var field, task_name;
      
      field = $(this.task_name);
      task_name = field.val();

      if (addTask(task_name)) {
        field.val('');
      } else {
         showFormError(this);
      }
      field.focus().select();
    });

    $('#tasks').sortable({
      update: save,
      // update: function({save(ewwqqweqw)})  -- save with parameters if needed
    });
  }

  return Listly;
}();

var listly = new Listly();
