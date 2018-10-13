Rails.application.routes.draw do
  root 'home#index'

  namespace :app do
    root to: 'app#index'
    get  "/*path" => "app#index"
    post "/*path" => "app#index"
  end
end
