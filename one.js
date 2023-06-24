$(document).ready(function() {
    // Initialize form validation
  
    //$("#form").validate();
    validate.collectFormValues($("#form"));
    // ... existing code ...

    console.log("After docu is loaded");
    var table = $('#expenseTable').DataTable({
        "lengthMenu": [ 3, 5, 10 ],
        "pageLength": 3,
        paging: true,
        ordering: false,
        info:true,
        searching:false,
    });
    

    $('#status').select2({
        dropdownParent: $('#ExpenseModal')
    });
    $('#totalAmount').text(table.column(2).data().sum());
     
   // working logic
    $("#addbtn").on('click',function(){
        console.log("add btn is clciked");
        $("#ExpenseModal").show();
        $("#form").show();
        $("#submitModalBtn").show();
        $("#saveModalBtn").hide();
       // $("#form").reset();
    });
    $("#cancelModalBtn").on('click',function(){
        $("#ExpenseModal").hide();
        $("$form").hide();
    });
    $("#cancelsign").on('click',function(){
        $("#ExpenseModal").hide();
        $("#form").hide();
    });

    $("#submitModalBtn").on('click', function(e) {
        e.preventDefault();

        // Check if the form is valid before submitting
        if ($("#form").valid()) {
            var expenseId = $('#expenseId').val();
            var description = $('#description').val();
            var amount = parseFloat($('#amount').val());
            var status = $('#status').val();
            console.log(expenseId, description, amount, status);

            table.row.add([expenseId, description, amount, status, '<button class="btn btn-info id" id="editbtn"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>&nbsp;&nbsp;<button class="btn btn-danger" id="deleteBtn"><i class="fa fa-trash" aria-hidden="true"></i></button>']).draw();

            $('#totalAmount').text(table.column(2).data().sum());
            $("#form")[0].reset();
            $("#form").hide();
            $("#ExpenseModal").hide();
        }
    });

    // ... existing code ...

    $("#expenseTable tbody").on("click", "#deleteBtn", function() {
        console.log("Inside delete btn...");
        table.row($(this).closest("tr")).remove().draw();
        $('#totalAmount').text(table.column(2).data().sum());
    });

    var rowData = [];
    var selectedRow;
    $("#expenseTable tbody").on('click', "#editbtn", function() {
 
        selectedRow = $(this).closest("tr");
        rowData = table.row(selectedRow).data();
        console.log(rowData);
        // document.getElementById('savebtn').style.visibility="visible";
    
        // Populate the form fields with the row data
        $("#expenseId").val(rowData[0]);
        $("#description").val(rowData[1]);
        $("#amount").val(rowData[2]);
        $("#status").val(rowData[3]);
        
       $("#ExpenseModal").show();
       $('#form').show();
       $('#submitModalBtn').hide();
       $('#saveModalBtn').show();
    });

    $("#saveModalBtn").on("click", function(event) {
        event.preventDefault();

        // Check if the form is valid before saving
        if ($("#form").valid()) {
            rowData[0] = $("#expenseId").val();
            console.log(rowData[0]);
            rowData[1] = $("#description").val();
            console.log(rowData[1]);
            rowData[2] = $("#amount").val();
            console.log(rowData[2]);
            rowData[3] = $("#status").val();
            console.log(rowData[3]);

            table.row(selectedRow).data(rowData).draw();
            $('#totalAmount').text(table.column(2).data().sum());
            $("#form").trigger("reset");
            $("#ExpenseModal").hide();
        }
    });

    // ... existing code ...
});
