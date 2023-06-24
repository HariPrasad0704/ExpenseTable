
$(document).ready(function() {
    console.log("After docu is loaded");
    var table = $('#expenseTable').DataTable({
        "lengthMenu": [ 3, 5, 10 ],
        "pageLength": 3,
        paging: true,
        ordering: false,
        info:true,
        searching:false,
    });

    // $('#status').select2({
    //     dropdownParent: $('#ExpenseModal')
    // });
    $('#totalAmount').text(table.column(2).data().sum());
     
   // working logic
    // $("#addbtn").on('click',function(){
    //     console.log("add btn is clciked");
    //     $("#ExpenseModal").show();
    //     $("#form").show();
    //     $("#submitModalBtn").show();
    //     $("#saveModalBtn").hide();
    //    // $("#form").reset();
    // });

    $("#addbtn").on('click', function() {
        console.log("add btn is clicked");
        $("#ExpenseModal").show();
        $("#form").show();
        $("#submitModalBtn").show();
        $("#saveModalBtn").hide();
        $("#expenseId").val(generateExpenseId());
        $("#expenseId").prop("readonly", true);
        $("#status").prop("disabled",true);
      });
      


    $("#cancelModalBtn").on('click',function(){
        $("#ExpenseModal").hide();
        $("#form")[0].reset();
        $("$form").hide();
    });
    $("#cancelsign").on('click',function(){
        $("#ExpenseModal").hide();
        $("#form")[0].reset();
        $("#form").hide();
    });
    $("#submitModalBtn").on('click',function(e){
        e.preventDefault();
        if(validateForm()){
        var expenseId = $('#expenseId').val();
        var description = $('#description').val();
        var amount = parseFloat($('#amount').val());
        var status=$('#status').val();
        console.log(expenseId,description,amount,status);
        

        table.row.add([expenseId,description,amount,status,'<button class="btn btn-info id" id="editbtn"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>&nbsp;&nbsp;<button class="btn btn-danger" id="deleteBtn"><i class="fa fa-trash" aria-hidden="true"></i></button>']).draw();

        $('#totalAmount').text(table.column(2).data().sum());
        $("#form")[0].reset();
        $("#form").hide();
        $("#ExpenseModal").hide();
        }

    });

    $("#expenseTable tbody").on("click", "#deleteBtn", function() {
        console.log("Inside delete btn...");
        Swal.fire({
            title: 'Do you really want to delete this row?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
            table.row($(this).closest("tr")).remove().draw();
            $('#totalAmount').text(table.column(2).data().sum());
            Swal.fire(
                'Deleted!',
                'Row has been deleted.',
                'success'
              )
            }
        });
       
       
    });

    var rowData = [];
    var selectedRow;
    $("#expenseTable tbody").on('click', "#editbtn", function() {
 
        selectedRow = $(this).closest("tr");
        rowData = table.row(selectedRow).data();
        console.log(rowData);
        $("#addExpenseModalLabel").text("Edit Expense Data")
        // document.getElementById('savebtn').style.visibility="visible";
    
          $("#expenseIdDiv").hide();
          $("#statusDiv").hide();
        $("#expenseId").val(rowData[0]);
    //    $("#expenseId").prop("readonly",true);
        $("#description").val(rowData[1]);
        $("#amount").val(rowData[2]);
        $("#status").val(rowData[3]);
    //    $("#status").prop("disabled",true);
        
       $("#ExpenseModal").show();
       $('#form').show();
       $('#submitModalBtn').hide();
       $('#saveModalBtn').show();
    });


    $("#saveModalBtn").on("click", function(event) {
         event.preventDefault();
        if(validateForm()){
        // Update the row data with the edited values
        rowData[0] = $("#expenseId").val();
        console.log(rowData[0]);
        rowData[1] = $("#description").val();
        console.log(rowData[1]);
        rowData[2] = $("#amount").val();
        console.log(rowData[2]);
        rowData[3]=$("#status").val();
        console.log(rowData[3]);
        
        table.row(selectedRow).data(rowData).draw(); 
        $('#totalAmount').text(table.column(2).data().sum());
        //$("#form").trigger("reset");
        $("#form")[0].reset();
        $("#ExpenseModal").hide();
        }
    });    
     
      function generateExpenseId() {
        var currentDate = new Date();
        var year = currentDate.getFullYear().toString().substring(2);
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var date = currentDate.getDate().toString().padStart(2, '0');
        var hours = currentDate.getHours().toString().padStart(2, '0');
        var minutes = currentDate.getMinutes().toString().padStart(2, '0');
        var expenseId = 'E' + date + month + '-' + hours + ':' + minutes;
        return expenseId;
      }
      
      

    function validateForm() {
        var expenseId = $('#expenseId').val();
        var description = $('#description').val();
        var amount = $('#amount').val();

        
        if (expenseId.trim() === '' ) {
            Swal.fire('Expense ID is required.');
            return false;
        }
        if (description.trim() === '') {
            Swal.fire('Description is required.');
            return false;
        }
        if (amount.trim() === '' || isNaN(parseFloat(amount))|| (parseFloat(amount)<0) ) {
            Swal.fire('Amount must be a valid number.');
            return false;
        }

        return true;
    }


});
