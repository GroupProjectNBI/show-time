namespace WebApp;

public static class RequestBodyParser
{
    public static dynamic ReqBodyParse(string table, Obj body)
    {
        // Always remove "role" for users table
        var keys = body.GetKeys().Filter(key => table != "users" || key != "role");
        // Clean up the body by converting strings to numbers when possible
        var cleaned = Obj();
        body.GetKeys().ForEach(key
            => cleaned[key] = ((object)(body[key])).TryToNumber());

        //Email validation for booking
        if (table == "Booking")
        {
            //Email has to exist and be of type string
            if (!cleaned.HasKey("email") || cleaned.email is not string)
            {
                return Obj(new { error = "Invalid email" });
            }

            var email = ((string)cleaned.email).Trim().ToLowerInvariant();

            if (!email.IsValidEmail())
            {
                return Obj(new
                {
                    error = "Invalid email"
                });
            }

            //save normalized email
            cleaned.email = email;
        }

        // Always encrypt fields named "password"
        if (cleaned.HasKey("password"))
        {
            cleaned.password = Password.Encrypt(cleaned.password + "");
        }
        // Return parts to use when building the SQL query + the cleaned body
        return Obj(new
        {
            insertColumns = keys.Join(","),
            insertValues = "@" + keys.Join(",@"),
            update = keys.Filter(key => key != "id").Map(key => $"{key}=@{key}").Join(","),
            body = cleaned
        });
    }
}