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
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class CrearteAccountActivity extends AppCompatActivity {

    EditText name_of_person,email_of_person,created_password,confirmed_password;
    Button create_account;
    Intent toMainActivity;
    FirebaseAuth auth;
    ProgressDialog progressDialog;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crearte_account);

        name_of_person = findViewById(R.id.name);
        email_of_person = findViewById(R.id.email);
        created_password = findViewById(R.id.create_password);
        confirmed_password = findViewById(R.id.confirm_password);
        create_account = findViewById(R.id.create_button);
        toMainActivity = new Intent(CrearteAccountActivity.this,LoginActivity.class);

        progressDialog = new ProgressDialog(CrearteAccountActivity.this);
        progressDialog.setTitle("new Account");
        progressDialog.setMessage("Creating new Account");

        auth = FirebaseAuth.getInstance();
        create_account.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressDialog.show();
                progressDialog.setCancelable(false);
                progressDialog.setCanceledOnTouchOutside(false);
                getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
                        WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                if(created_password.toString()==""||name_of_person.toString()==""||email_of_person.toString()=="")
                {
                    Toast.makeText(CrearteAccountActivity.this,"Enter valid details",Toast.LENGTH_SHORT).show();
                    progressDialog.hide();
                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                }
                else
                {
                    auth.createUserWithEmailAndPassword(email_of_person.getText().toString(),created_password.getText().toString())
                            .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if(task.isSuccessful()) {
                                String uid = task.getResult().getUser().getUid();
                                progressDialog.setMessage("Account Created Successfully");

                                auth.getCurrentUser().sendEmailVerification().
                                        addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                if(task.isSuccessful()) {
                                                    progressDialog.hide();
                                                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                                                    startActivity(toMainActivity);
                                                }
                                                else {
                                                    Toast.makeText(CrearteAccountActivity.this, task.getException().getMessage()
                                                            , Toast.LENGTH_SHORT).show();
                                                    progressDialog.hide();
                                                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                                                }
                                            }

                                        });
                            }
                            else
                            {
                                Toast.makeText(CrearteAccountActivity.this, task.getException().getMessage(), Toast.LENGTH_LONG).show();
                                progressDialog.hide();
                                getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
                            }
                        }
                    });

                }
            }
        });

    }
}