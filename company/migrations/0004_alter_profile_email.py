# Generated by Django 4.1.4 on 2023-01-29 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0003_alter_profile_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
