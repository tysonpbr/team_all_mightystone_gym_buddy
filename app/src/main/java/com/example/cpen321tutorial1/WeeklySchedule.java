package com.example.cpen321tutorial1;

import static com.example.cpen321tutorial1.CalendarUtils.daysInMonthArray;
import static com.example.cpen321tutorial1.CalendarUtils.monthYearFromDate;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

//The Implementation of Schedule is base on the tutorial from Youtube
//https://www.youtube.com/watch?v=Ba0Q-cK1fJo&list=LL&index=6
//https://www.youtube.com/watch?v=knpSbtbPz3o&list=LL&index=4&t=541s
//https://www.youtube.com/watch?v=Aig99t-gNqM&list=LL&index=6&t=238s
//Thanks for the support from @Code With Cal

public class WeeklySchedule extends AppCompatActivity implements CalendarAdapter.OnItemListener{

    private TextView monthYearText;
    private RecyclerView calendarRecyclerView;
    private Button PreviousMonth;
    private Button NextMonth;
    private Button Model;
    final static String TAG = "Schedule";

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_weekly_schedule);
        initinalWidgets();
        CalendarUtils.selectedDate = LocalDate.now();
        setMonthView();

        PreviousMonth = findViewById(R.id.PreviousMonthAction);
        NextMonth = findViewById(R.id.NextMonthAction);

        PreviousMonth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CalendarUtils.selectedDate = CalendarUtils.selectedDate.minusMonths(1);
                setMonthView();
            }
        });

        NextMonth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CalendarUtils.selectedDate = CalendarUtils.selectedDate.plusMonths(1);
                setMonthView();
            }
        });

        Model = findViewById(R.id.Model);
        Model.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent WeeklyIntent = new Intent(WeeklySchedule.this, WeekView.class);
                startActivity(WeeklyIntent);
            }
        });
    }

    private void setMonthView() {
        monthYearText.setText(monthYearFromDate(CalendarUtils.selectedDate));
        ArrayList<LocalDate> daysInMonth = daysInMonthArray(CalendarUtils.selectedDate);

        CalendarAdapter calendarAdapter = new CalendarAdapter(daysInMonth, this);
        RecyclerView.LayoutManager layoutManager = new GridLayoutManager(getApplicationContext(), 7);
        calendarRecyclerView.setLayoutManager(layoutManager);
        calendarRecyclerView.setAdapter(calendarAdapter);
    }



    private void initinalWidgets() {
        calendarRecyclerView = findViewById(R.id.calendarRecyclerView);
        monthYearText = findViewById(R.id.WeekDay);
    }

    @Override
    public void onItemClick(int position, LocalDate date) {
        if(date != null) {
            CalendarUtils.selectedDate = date;
            setMonthView();
        }
    }
}