////////////////////////////////////////////FILE READER //////////////////////////////////////////////
////////////////////////////////////////////FILE READER //////////////////////////////////////////////

var reader; //GLOBAL File Reader object

/****************************************
* Check for the various File API support.
*/
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}


/*********************************************
* read text input
*/
function readText(filePath) {
    var output = ""; //placeholder for text output
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            //alert(output);
            displayContents(output);
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if (ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            displayContents(output);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                 'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                 'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}

/*****************************************************
* display content using a basic HTML replacement
*/
function displayContents(txt) {
    var el = document.getElementById('main');
    var obj = JSON.parse(txt);
    console.log(obj);
    //obj.forEach()
    $.each(obj, function (key, data) {
        console.log(key);
        $.each(data, function(index,data){
        console.log('index', data);
        })
    })
    el.innerHTML = txt; //display output in DOM

}



////////////////////////////////////////////FILE READER //////////////////////////////////////////////
////////////////////////////////////////////FILE READER //////////////////////////////////////////////





////////////////////////////////////////////FIREBASE READER//////////////////////////////////////////////
////////////////////////////////////////////FIREBASE READER//////////////////////////////////////////////


/*****************************************************
* read data once from firebase
*/
var ref;//firebase reader/writer
function displayChilds(url, user, pwd) {

    // Get a database reference to our data
    ref = new Firebase(url);


    //Authenticazione utente
    var elUser = document.getElementById('UserFirebase');
    ref.authWithPassword({
        email: user,
        password: pwd
    }, function (error, authData) {
        if (error) {
            ref.createUser({
                email: user,
                password: pwd
            }, function (error, userData) {
                if (error) {
                    elUser.innerHTML = "Error creating user:" + error;
                } else {
                    elUser.innerHTML = "User " + userData.uid + " is logged in with provider: " + userData.provider;
                    getData(ref);
                }
            });
        } else {
            elUser.innerHTML = "Authenticated successfully with payload:" + authData;
            getData(ref);
        }
    });

}


/*****************************************************
* authentication module to firebase database 
*/
function getData(ref) {
    // Attach an asynchronous callback to read the data at our data reference
    var el = document.getElementById('MainFirebase');
    ref.once("value", function (snapshot) {
        el.innerHTML = "database value: " + ParseData(snapshot);
    }, function (errorObject) {
        el.innerHTML = "The read failed: " + errorObject.code;
    });

}


/*****************************************************
* recursive read of firebase data 
*/
function ParseData(snapshot) {
    var output = "...";
    //var sel = document.getElementById('selectBranch');
    $('#selectBranch').html('');
    
    snapshot.forEach(function (childsnapshot) {
        var key = childsnapshot.key();
        var childData = childsnapshot.val();
        $('#selectBranch')
            .append($('<option>', { key: key })
            .text(key));
        //sel.appendChild(key);
        output = output + "\n" + key;
        //alert(key + ":" + childData);
    });
    return output;
}

//// Authenticate users with a custom authentication token
//ref.authWithCustomToken("<token>", authHandler);

//// Alternatively, authenticate users anonymously
//ref.authAnonymously(authHandler);

//// Or with an email/password combination
//ref.authWithPassword({
//    email: 'bobtony@firebase.com',
//    password: 'correcthorsebatterystaple'
//}, authHandler);

//// Or via popular OAuth providers ("facebook", "github", "google", or "twitter")
//ref.authWithOAuthPopup("<provider>", authHandler);
//ref.authWithOAuthRedirect("<provider>", authHandler);

////////////////////////////////////////////FIREBASE READER//////////////////////////////////////////////
////////////////////////////////////////////FIREBASE READER//////////////////////////////////////////////



////////////////////////////////////////////FILE WRITER //////////////////////////////////////////////
////////////////////////////////////////////FILE WRITER //////////////////////////////////////////////

function Insert() {
    var el = document.getElementById('main');
    //alert(el.innerHTML);
    var dbcon = document.getElementById('DBConn').value;
    //alert(dbcon);
    var selectB = document.getElementById('selectBranch');
    var selection = selectB.options[selectB.selectedIndex].value;
    //alert(selection);
    dbcon = dbcon + selection + "/";
    //alert(dbcon);
    InsertData(el.innerHTML, selection);
}

function InsertData(txt, branch) {
    var obj = JSON.parse(txt);
    var pusher = ref.child(branch);
    var output = "";


    $.each(obj, function (key, data) {
        console.log(key);
        output = output + "<br>" + pusher.push(data);
        
        //$.each(data, function (index, data) {
            //pusher.push(data);
        //    console.log('index', data);
        //})
    })
    var el = document.getElementById('result');
    el.innerHTML = output;

}

////////////////////////////////////////////FILE WRITER //////////////////////////////////////////////
////////////////////////////////////////////FILE WRITER //////////////////////////////////////////////
