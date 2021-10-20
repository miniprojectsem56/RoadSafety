package com.example.roadsafety;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class CrearteAccountActivity extends AppCompatActivity {

    EditText name_of_person,email_of_person,created_password,confirmed_password;
    Button create_account;
    Intent toMainActivity;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crearte_account);

        name_of_person = findViewById(R.id.name);
        email_of_person = findViewById(R.id.email);
        created_password = findViewById(R.id.create_password);
        confirmed_password = findViewById(R.id.confirm_password);

        toMainActivity = new Intent(CrearteAccountActivity.this,MainActivity.class);

        create_account.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(created_password.toString()==""||created_password.toString()!=confirmed_password.toString()||name_of_person.toString()==""||email_of_person.toString()=="")
                {
                    Toast.makeText(CrearteAccountActivity.this,"Enter valid details",Toast.LENGTH_SHORT).show();
                }
                else
                {
                    Toast.makeText(CrearteAccountActivity.this,"Account created",Toast.LENGTH_SHORT).show();
                    startActivity(toMainActivity);
                }
            }
        });

    }
}