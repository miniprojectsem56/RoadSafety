package com.example.roadsafety;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class LoginActivity extends AppCompatActivity {

    EditText name;
    EditText password;
    Button loginButton,signIn;

    String nameAtFirebase = "Bhargav";
    String passwordAtFirebase = "Bhargav@123";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        name = findViewById(R.id.username_et);
        password = findViewById(R.id.password_et);
        loginButton = findViewById(R.id.login_button);
        signIn = findViewById(R.id.sign_in);

        Intent LoginValidated = new Intent(LoginActivity.this,MainActivity.class);
        Intent toCreateAccount = new Intent(LoginActivity.this,CrearteAccountActivity.class);

        signIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(toCreateAccount);
            }
        });

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String inputted_name = name.getText().toString();
                String inputted_password = password.getText().toString();
                if(inputted_name.length()==0||inputted_password.length()==0)
                {
                    Toast.makeText(LoginActivity.this,"Fill everything correctly",Toast.LENGTH_LONG).show();
                }
                else if(!inputted_password.equals(passwordAtFirebase))
                {
                    Toast.makeText(LoginActivity.this,"Fill password correctly",Toast.LENGTH_LONG).show();
                }
                else
                {
                    startActivity(LoginValidated);
                }

            }

        });
    }
}