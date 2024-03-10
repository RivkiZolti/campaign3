async function login(username, password) {
        let payload = {
            'username': username,
            'password': password
        };
        const res = await apiRequests.postWithHeaders("Login" ,JSON.stringify(payload),'שם המשתמש או הסיסמא שגויים')
        if (!res) {
            $('#reset').show()
            return false
        }

        appModule.setToken(username+ ":" + password)
        return true 
}

function togglePassword() {
    let passwordInput = $("#password");
    let toggleIcon = $("#toggle-password i");

    if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
        toggleIcon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        passwordInput.attr("type", "password");
        toggleIcon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
}
