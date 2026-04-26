FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY SocialMediaApp/SocialMediaApp.csproj SocialMediaApp/
RUN dotnet restore SocialMediaApp/SocialMediaApp.csproj

COPY SocialMediaApp/ SocialMediaApp/
WORKDIR /src/SocialMediaApp
RUN dotnet publish SocialMediaApp.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SocialMediaApp.dll"]
