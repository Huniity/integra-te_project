from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("integrate", "0004_aula_add_ficheiro"),
    ]

    operations = [
        # Exercicio new fields
        migrations.AddField(
            model_name="exercicio",
            name="thumbnail_url",
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="exercicio",
            name="video_url",
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name="exercicio",
            name="ficheiro",
            field=models.FileField(blank=True, null=True, upload_to="exercicios/"),
        ),
        migrations.AddField(
            model_name="exercicio",
            name="duration",
            field=models.IntegerField(blank=True, null=True),
        ),
        # Jogo new fields
        migrations.AlterField(
            model_name="jogo",
            name="faixa_etaria",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="jogo",
            name="subject_id",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="jogo",
            name="level",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="jogo",
            name="thumbnail_url",
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="jogo",
            name="video_url",
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name="jogo",
            name="duration",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
