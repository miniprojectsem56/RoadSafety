package com.example.roadsafety;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class LoginActivity extends AppCompatActivity {

    EditText name;
    EditText password;
    Button loginButton,signIn;
    ProgressDialog progressDialog;
    FirebaseAuth auth;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        auth = FirebaseAuth.getInstance();
        if(auth.getCurrentUser()!=null) {
            startActivity((new Intent(LoginActivity.this, MainActivity.class)));
            finish();
        }

        progressDialog = new ProgressDialog(LoginActivity.this);
        progressDialog.setTitle("LogIn");
        progressDialog.setMessage("Signing in please wait");
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
                progressDialog.show();
                progressDialog.setCancelable(false);
                progressDialog.setCanceledOnTouchOutside(false);
                getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
                        WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                String inputted_name = name.getText().toString();
                String inputted_password = password.getText().toString();
                if(inputted_name.length()==0||inputted_password.length()==0)
                {
                    Toast.makeText(LoginActivity.this,"Fill everything correctly",Toast.LENGTH_LONG).show();
                    progressDialog.hide();
                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                }
                else{
                    auth.signInWithEmailAndPassword(inputted_name, inputted_password).
                            addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if (task.isSuccessful()) {
                                if (auth.getCurrentUser().isEmailVerified()) {
                                    progressDialog.hide();
                                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                                    startActivity(LoginValidated);
                                }
                                else {
                                    progressDialog.hide();
                                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                                    Toast.makeText(LoginActivity.this, "Incorrect email or password",
                                            Toast.LENGTH_SHORT).show();
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}