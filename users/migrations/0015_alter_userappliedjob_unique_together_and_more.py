# Generated by Django 4.1.4 on 2023-02-11 16:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0018_alter_jobitem_options'),
        ('users', '0014_profile_is_admin_created'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='userappliedjob',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='usersavedjob',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='userappliedjob',
            name='profile',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_applied_job_profile', to='users.profile'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='usersavedjob',
            name='profile',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_saved_job_profile', to='users.profile'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='userappliedjob',
            unique_together={('profile', 'job')},
        ),
        migrations.AlterUniqueTogether(
            name='usersavedjob',
            unique_together={('profile', 'job')},
        ),
        migrations.RemoveField(
            model_name='userappliedjob',
            name='user',
        ),
        migrations.RemoveField(
            model_name='usersavedjob',
            name='user',
        ),
    ]