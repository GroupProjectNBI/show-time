# --- STAGE 1: Bygg Frontend (React/Vite) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: Bygg Backend (C# - Nu uppgraderad till .NET 10.0) ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /app/backend

# Kopiera projektfilen (Nu ser vi att den heter Backend.csproj)
COPY backend/Backend.csproj ./
RUN dotnet restore

# Kopiera resten av backend-koden
COPY backend/ ./

# Hämta den färdiga frontenden från Stage 1
COPY --from=frontend-builder /app/dist ./wwwroot

RUN dotnet publish -c Release -o /out

# --- STAGE 3: Runtime (Nu uppgraderad till .NET 10.0) ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=backend-builder /out .

ENV DOTNET_RUNNING_IN_CONTAINER=true
EXPOSE 3001

# VIKTIGT: Namnet här baseras på ditt felmeddelande (Backend.csproj -> Backend.dll)
ENTRYPOINT ["dotnet", "Backend.dll"]