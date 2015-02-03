// Product details window
function ShowDetails(id) {
    var url = "LearnMore.aspx?offer=" + id;
    var features = 'dialogHeight:650px;dialogWidth:750px;center:yes;resizable:no;edge:raised;status:no;';
    var tagid = window.showModalDialog(url, "Details", features);

    return false;
}

function OpenCustomization(id) {
    var url = "customizationdetails.aspx?product=" + id;
    var features = 'dialogHeight:400px;dialogWidth:500px;center:yes;resizable:no;edge:raised;status:no;';
    window.showModalDialog(url, "customizationdetails", features);
    return false;
}

// Product comparison window
function ValidateCheckboxes() {
    var inputs = document.getElementsByTagName("input");
    var counter = 0;
    var productIds = "";

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox" && inputs[i].id.indexOf('chkSelect') > -1) {
            if (inputs[i].checked) {
                productIds = productIds + inputs[i].id.split('__')[1] + "|";
                counter++;
            }
        }
    }
    if (counter < 2) {
        alert("Please select atleast 2 services to compare");
        return false;
    }
    if (counter > 3) {
        alert("You cannot compare more than 3 services");
        return false;
    }
    var url = "Compare.aspx?products=" + productIds;
    var features = 'dialogHeight:650px;dialogWidth:750px;center:yes;resizable:no;edge:raised;status:no;';
    var tagid = window.showModalDialog(url, "Compare", features);

    return false;
}

function OpenWindow(path) {
    window.open(path, 'CM', 'scrollbars=1,location=0,menubar=0,resizable=1,status=0,toolbar=0,replace=true,width=710,height=680');
}

function OpenGiftCardDetails() {
    window.open('clients/combun/GCDisclaim.aspx', 'CM', 'scrollbars=1,location=0,menubar=0,resizable=0,status=0,toolbar=0,replace=true,width=710,height=680');
}

function OpenXfinityGiftCardDetails() {
    window.open('../../../library/clients/comxfn/GCDisclaim.html', 'CM', 'scrollbars=1,location=0,menubar=0,resizable=0,status=0,toolbar=0,replace=true,width=710,height=680');
}