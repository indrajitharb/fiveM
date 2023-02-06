# Generated by Django 4.1.4 on 2022-12-27 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Mode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('readonly', models.BooleanField(default=False)),
                ('maintenance', models.BooleanField(default=False)),
                ('down', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'mode',
                'verbose_name_plural': 'mode',
                'db_table': 'mode',
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='Prefix',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=128)),
                ('prefix', models.CharField(max_length=128)),
            ],
            options={
                'verbose_name': 'prefix',
                'verbose_name_plural': 'prefixes',
                'db_table': 'prefixes',
                'ordering': ('prefix',),
            },
        ),
    ]
