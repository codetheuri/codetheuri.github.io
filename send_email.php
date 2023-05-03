<?php
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "theurij113@gmail.com";
    $subject = "New Message from your server";
    $body = "Name: $name  \nEmail: $email\n\n$message";
    if(mail($to,$subject,$body)){
        echo"This message has been sent";
}else{
    echo "Oops! Something went wrong. Please try again later.";
}
}
?>
