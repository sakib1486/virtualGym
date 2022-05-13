from django.contrib import admin

from server.models import User, Session

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    search_fields = ['email', 'username', 'firstName', 'lastName']
    list_display = ['email', 'username','approved','firstName','lastName'] 

class SessionAdmin(admin.ModelAdmin):
    search_fields = ['gameType', 'version','deviceId']
    list_display = ['user','gameType','version','deviceId','startTime','endTime'] 

admin.site.register(User, UserAdmin)
admin.site.register(Session, SessionAdmin)


